
export const ERROR_MESSAGES = {
    NOT_FOUND: (data: string) => `${data} not found`,
    UNABLE_TO_UPDATE: (resource: string) => `Unable to update ${resource}`,
    DOESNOT_MATCH: (field: string) => `${field} doesnot match`,
    INVALID_INPUT_PAYLOAD: (field: string) => `Invalid input payload for field: ${field}`,
    REQUIRED: (field: string) => `${field} is required`,
    ERROR_RETREIVING: (field: string) => `Error retreiving ${field}`,
    SERVER_ERROR: 'Internal Server Error',
    RESET_PASSWORD: 'Unable to reset password',
    NOT_VERIFIED: 'Otp not verified',
    IMAGE_ONLY: 'Only image files are allowed',
    ALREADY_EXISTS: (field: string) => `${field} already exists`,
    UNABLE_TO_CREATE: (field: string) => `Unable to create ${field}`,
    UNABLE_TO_FETCH: (field: string) => `Unable to fetch ${field}`,
    UNABLE_TO_DELETE: 'Unable to delete item',
    REGISTERED_EMAIL: 'Please enter registered email id',
    INVALID_EMAIL: 'Please enter registered email or password'
};

export const SUCCESS_MESSAGES = {
    OTP_VERIFIED: 'Otp verified successfully',
    USER_UPDATED: (userName: string) => `${userName} successfully updated`,
    RESOURCE_CREATED: (resourceName: string) => `${resourceName} created successfully`,
    UPLOAD_SUCCESS: 'File uploaded successfully',
    LOGOUT: 'User logout successfully',
    DEACTIVATED: 'User deactivated successfully',
    RESET_PASSWORD: 'Password reset successfully and new password sent on email',
    DELETED: (resource: string) => `${resource} deleted successfully.`
};

