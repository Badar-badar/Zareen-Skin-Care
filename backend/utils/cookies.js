/**
 * Cookie Helper Utility
 * Manages setting and clearing secure HTTP-only authentication cookies.
 */

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  const sameSite = process.env.COOKIE_SAME_SITE || (isProduction ? 'none' : 'lax');
  const isSecure = process.env.COOKIE_SECURE ? process.env.COOKIE_SECURE === 'true' : isProduction;

  return {
    httpOnly: true,
    secure: isSecure,
    sameSite: sameSite,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/',
  };
};

const getCookieName = () => process.env.COOKIE_NAME || 'zareen_auth_token';

/**
 * Set HTTP-Only authentication cookie on response
 * @param {Response} res - Express response object
 * @param {String} token - Signed JWT token
 */
const setAuthCookie = (res, token) => {
  const cookieName = getCookieName();
  const options = getCookieOptions();
  res.cookie(cookieName, token, options);
};

/**
 * Clear authentication cookie from response
 * @param {Response} res - Express response object
 */
const clearAuthCookie = (res) => {
  const cookieName = getCookieName();
  const options = getCookieOptions();
  res.clearCookie(cookieName, {
    ...options,
    maxAge: 0,
  });
};

module.exports = {
  getCookieName,
  getCookieOptions,
  setAuthCookie,
  clearAuthCookie,
};
