import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import { sendNotifications } from '../../../helpers/notificationHelper';
import unlinkFile from '../../../shared/unlinkFile';

const createUser = async (payload: IUser) => {
  if (payload.role && payload.role === USER_ROLES.ADMIN) {
    throw new ApiError(
      StatusCodes.FORBIDDEN,
      'You cannot create an Admin user from this route.',
    );
  }

  if (payload.verified === true) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Cannot create a verified user directly.',
    );
  }

  payload.role = USER_ROLES.USER;

  const result = await User.create(payload);

  if (!result) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const otp = generateOTP();
  const emailValues = {
    name: `${result.name} `,
    otp,
    email: result.email,
  };

  const accountEmailTemplate = emailTemplate.createAccount(emailValues);
  emailHelper.sendEmail(accountEmailTemplate);

  // Update user with authentication details
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 10 * 60000),
  };
  const updatedUser = await User.findOneAndUpdate(
    { _id: result._id },
    { $set: { authentication } },
  );
  if (!updatedUser) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found for update');
  }

  if (result) {
    // Send notification to admin
    const data = {
      text: `Registered successfully, ${result?.name}`,
      type: 'ADMIN',
    };

    await sendNotifications(data);
  }

  return result;
};

const getAllUsers = async (query: Record<string, unknown>) => {
  const { page, limit, searchTerm, ...filterData } = query;
  const conditions: any[] = [];

  if (searchTerm) {
    conditions.push({
      $or: [{ name: { $regex: searchTerm, $options: 'i' } }],
    });
  }
  // Add filter conditions
  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.entries(filterData).map(
      ([field, value]) => ({
        [field]: value,
      }),
    );
    conditions.push({ $and: filterConditions });
  }
  conditions.push({ role: USER_ROLES.USER });

  const whereConditions = conditions.length ? { $and: conditions } : {};

  // Pagination setup
  const pages = parseInt(page as string) || 1;
  const size = parseInt(limit as string) || 10;
  const skip = (pages - 1) * size;

  // Set default sort order to show new data first

  const result = await User.find(whereConditions)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(size)
    .lean<IUser[]>(); // Assert type
  const total = await User.countDocuments(whereConditions);

  return {
    result,
    meta: {
      page: pages,
      limit: size,
      total,
    },
  };
};

const getUserProfileFromDB = async (
  user: JwtPayload,
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.findById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>,
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);

  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  if (isExistUser?.verified === false) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      'Please verify your account, then try to login again',
    );
  }

  // Delete old images if new images are provided
  if (payload.image && isExistUser.image) {
    if (Array.isArray(isExistUser.image)) {
      isExistUser.image.forEach((img: string) => unlinkFile(img));
    } else {
      unlinkFile(isExistUser.image as string);
    }
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

const getSingleUser = async (id: string): Promise<IUser | null> => {
  const result = await User.findById(id);
  return result;
};

const deleteAccount = async (user: JwtPayload): Promise<IUser | null> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  const updateDoc = await User.findOneAndUpdate(
    { _id: id },
    { isDeleted: true },
    {
      new: true,
    },
  );
  return updateDoc;
};

export const UserService = {
  createUser,
  getUserProfileFromDB,
  updateProfileToDB,
  getSingleUser,
  getAllUsers,
  deleteAccount,
};
