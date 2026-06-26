/**
 * DTOs — strip sensitive fields before returning to client
 */

const userDto = (user) => ({
  id: user.id,
  email: user.email,
  username: user.username,
  firstName: user.firstName,
  lastName: user.lastName,
  avatar: user.avatar,
  isActive: user.isActive,
  isVerified: user.isVerified,
  role: user.role ? user.role.name : null,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const authResponseDto = (user, accessToken, refreshToken) => ({
  user: userDto(user),
  accessToken,
  refreshToken,
});

module.exports = { userDto, authResponseDto };
