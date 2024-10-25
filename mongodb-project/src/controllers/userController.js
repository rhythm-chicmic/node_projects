import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { deleteFromCloudinary, uploadOnCloudnary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken';

const generateAccessAndRefreshToken  = async (userId) => {
try {
    const user = await User.findById(userId);
   if(!user) {
    throw ApiError(400, 'User Not Found');
   }
   const accessToken =  user.generateAccessToken();

   const refreshToken = user.generateRefreshToken();

   user.refreshToken = refreshToken;

   await user.save({ validateBeforeSave: false });

   return { refreshToken, accessToken };
}
catch(err){
    throw ApiError(500, "Something went wrong while genrating access and refresh token");
}
}


const loginUser = asyncHandler( async (req, res) => {
    // get data from body
    const { email, username, password } = req.body;

    // validation
    if(!email){
        throw new ApiError(400, "Email is Required");
    }

    const user = user.findOne({
        $or: [{ username }, { email }]
    });

    if(!user) {
        throw new ApiError(404, "User not found");
    }


    //validate Password

    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(400, "Invalid user Password");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user?._id);   ''

    const loggedInUser = await user.findById(user?._id).select(" -password -refreshToken");

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production"
    }


    return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200,{user: loggedInUser, accessToken, refreshToken}, "User LoggedIn Successfully"))



});




const registerUser= asyncHandler( async (req, res) => {
    // TODO
    const {fullName, email, password,username} =req.body;

    console.log({fullName, email, password,username},req.body);


    // validation
    if([fullName, email, password, username].some(field=> field?.trim() =="")){
        throw new ApiError(400,"All fields are Required");
    }

    const existedUser = await User.findOne({
        $or: [{username},{email}]
    });

    if(existedUser){
        throw new ApiError(409, "User with  email or username already exists");
    }

   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverLocalPath = req.files?.coverImage[0]?.path;


   console.log(avatarLocalPath, coverLocalPath);


//    if(!avatarLocalPath){
//     throw new ApiError(400, "Avatar File is Missing");
//    }

//    if(!coverLocalPath){
//     throw new ApiError(400, "Cover File is Missing");
//    }

//    const avatar = await uploadOnCloudnary(avatarLocalPath);
//    const coverImage = await uploadOnCloudnary(coverLocalPath);


    let avatar;
    try {
       avatar = await uploadOnCloudnary(avatarLocalPath);
       console.log('Uploaded Avatar ', avatar);

    }
    catch(e){
        console.log("Error Uploading avatar ",error);
        throw new ApiError(500, "Failed To Upload Avatar");

    }

    let coverImage;
    try {
        coverImage = await uploadOnCloudnary(coverLocalPath);
       console.log('Uploaded CoverImage ', coverImage);

    }
    catch(e){
        console.log("Error Uploading coverImage ",error);
        throw new ApiError(500, "Failed To Upload coverImage");

    }
try {


   const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage.url,
    email,
    password,
    username: username.toLowerCase()
   })

   const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
   );
   if(!createdUser){
    throw new ApiError(500, 'Something went wrong while registering the user');
   }

   return res.status(201).json(new ApiResponse(201,createdUser, "User Registered Successfully"));

}
catch(err){
    console.log("User creation failed",err);
    if(avatar){
        await deleteFromCloudinary(avatar.public_id);
    }
    if(coverImage) {
        await deleteFromCloudinary(coverImage.public_id);
    }
    throw new ApiError(500, 'Something went wrong while registering the user and images were  deleted');

}
});

const logoutUser = asyncHandler(async (req, res) => {
        await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    refreshToken: undefined
                }
            },
            { new: true }

        )
        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV == 'production'
        }
        return res.status(200)
                .clearCookie("accessToken",options)
                .clearCookie("refreshToken", options)
                .json(new ApiResponse(200,{}, "User Logged Out Successfully"));
});

const refershAccessToken = asyncHandler(async (req ,res) => {
    const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken) {
        throw new ApiError(401, "Refresh Token is Required");
    }

    try{
        const decodedToken = jwt.verify( incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user =  await User.findById(decodedToken?._id );

        if(!user) {
            throw new ApiError(401, "Invalid refresh Token");
        }

        if(user?.refreshToken != incomingRefreshToken){
            throw new ApiError(401, "Refresh Token Invalid");
        }

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production"
        }

        const {accessToken, refershTokrn : newRefreshToken } = await generateAccessAndRefreshToken(user?._id);

        return res.status(200).cookie("accessToken",accessToken).cookiee("refershToken",newRefreshToken, options)
            .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken },"Access token refreshed Successfully"));


    }
    catch(err) {
        console.log(err);
        throw new ApiError(500, "Something went wrong while refreshing the accessToken")
    }


});

const changeCurrentPassword  = asyncHandler(async (req,res) => {
    const { oldPassword, newPassword }  = req.body;
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        throw new ApiError(401, "Old Password is incorrect");
    }

    user.password = newPassword;

    await user.save({validateBeforeSave: false});

    return res.status(200).json(new ApiResponse(200, {}, "Password changed Successfully"));



});

const getCurrentUser  = asyncHandler(async (req,res) => {

    res.status(200).json(new ApiResponse(200, req.user, "Current user Details"))

});

const updateAccountDetails  = asyncHandler(async (req,res) => {
    const { fullName, email } = req.body;
    if(!fullName || !email){
        throw new ApiError(400, "FullName and Email is Required")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email: email,
            },
        },
        { new: true }
    ).select("-password -refreshToken")

    return res.status(200).json( new ApiResponse(200, user, "Account Details Updated Successfully"))

});

const updateUserAvatar  = asyncHandler(async (req,res) => {
    const avatarLocalPath = req.files?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "File is Required");
    }

    const avatar = await uploadOnCloudnary(avatarLocalPath);

    if(!avatar.url){
        throw new ApiError(500, "Something went wrong while uploading avatar")
    }

    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatar.url
            }
        },
        { new : true }
    ).select("-password -refreshToken")

    res.status(200).json(new ApiResponse(200, user, "Avatar updated Successfully"));
});


const updateUserCoverImage  = asyncHandler(async (req,res) => {
    const coverImageLocalPath = req.files?.path;

    if(!coverImageLocalPath){
        throw new ApiError(400, "File is Required");
    }

    const coverImage = await uploadOnCloudnary(coverImageLocalPath);

    if(!coverImage.url){
        throw new ApiError(500, "Something went wrong while uploading coverImage")
    }

    await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImage.url
            }
        },
        { new : true }
    ).select("-password -refreshToken")

    res.status(200).json(new ApiResponse(200, user, "coverImage updated Successfully"));

});

const getUserChannelProfile = asyncHandler(async (req,res) =>{
    const { username } = req.params;
    if(!username.trim()){
        throw new ApiError(400, "Username is Required");
    }
    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: 'subscriptions',
                localField: "_id",
                foreignField: "channel",
                as: 'subscribers'
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: '_id',
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: { $size: "$subscribers"  },
                channelsSubscribedToCount: { $size: "$subscribedTo" },
                isSubscribed: { $cond: {
                    $if: { $in: [req.user?._id, "$subscribers.subscriber"] },
                    then: true,
                    else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username:1,
                avatar:1,
                subscribersCount:1,
                channelsSubscribedToCount: 1,
                isSubscribed:1,
                coverImage:1,
                email:1
            }
        }

    ])

    if(!channel.length){
        throw new ApiError(404, "Channel not Found");
    }

    return res.status(200).json(new ApiResponse(200,channel[0], "Channel profile fetched successfully"));
});

const getWatchHistory = asyncHandler(async (req,res) =>{
    const { user } = await User.aggregate([
        {
            $match: {
                _id: new  mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $lookup: {
                from: "Videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from : "users",
                            localField:"owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        },
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        },

    ])

    if(!user.length){

    }

    return res.status(200).json(new ApiResponse(200, user[0]?.watchHistory, "Watch history fetched Successfully"));

});

export { registerUser, loginUser, refershAccessToken , logoutUser, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory };