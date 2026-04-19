const { ActionLog } = require('./models');

/**
 * Utility to log user and system actions.
 * @param {Object} params
 * @param {number|null} params.userId - ID of the user performing the action
 * @param {string|null} params.userName - Name of the user
 * @param {string} params.actionType - Type of action (e.g., 'LOGIN', 'CREATE_ORDER')
 * @param {string} params.description - Human readable description
 * @param {Object|null} params.details - Extra data for audit
 * @param {string|null} params.ipAddress - Requesting IP
 */
const logAction = async ({ userId, userName, actionType, description, details, ipAddress }) => {
  try {
    await ActionLog.create({
      userId,
      userName,
      actionType,
      description,
      details,
      ipAddress
    });
  } catch (err) {
    console.error('Logging Error:', err);
  }
};

module.exports = { logAction };
