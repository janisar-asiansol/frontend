// src/utils/time.ts

/**
 * Formats a UTC timestamp to Pakistani time (PKT - UTC+5)
 * @param utcString - UTC timestamp string from the server
 * @returns Formatted time string in PKT (e.g., "2:30 PM")
 */
export const formatToPakistaniTime = (utcString: string): string => {
  if (!utcString) return '';
  
  try {
    const date = new Date(utcString);
    
    // Pakistani Standard Time is UTC+5
    const pktOffset = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
    const pktTime = new Date(date.getTime() + pktOffset);
    
    return pktTime.toLocaleTimeString('en-PK', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting Pakistani time:', error);
    return '';
  }
};

/**
 * Formats a UTC timestamp to Pakistani date and time
 * @param utcString - UTC timestamp string from the server
 * @returns Formatted date-time string in PKT (e.g., "Jan 1, 2:30 PM")
 */
export const formatToPakistaniDateTime = (utcString: string): string => {
  if (!utcString) return '';
  
  try {
    const date = new Date(utcString);
    const pktOffset = 5 * 60 * 60 * 1000;
    const pktTime = new Date(date.getTime() + pktOffset);
    
    return pktTime.toLocaleString('en-PK', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting Pakistani date-time:', error);
    return '';
  }
};

/**
 * Checks if a UTC timestamp is today in Pakistani time
 * @param utcString - UTC timestamp string from the server
 * @returns boolean indicating if the date is today in PKT
 */
export const isToday = (utcString: string): boolean => {
  if (!utcString) return false;
  
  try {
    const date = new Date(utcString);
    const pktOffset = 5 * 60 * 60 * 1000;
    const pktTime = new Date(date.getTime() + pktOffset);
    const today = new Date();
    
    return (
      pktTime.getDate() === today.getDate() &&
      pktTime.getMonth() === today.getMonth() &&
      pktTime.getFullYear() === today.getFullYear()
    );
  } catch (error) {
    console.error('Error checking if date is today:', error);
    return false;
  }
};

/**
 * Checks if a UTC timestamp is yesterday in Pakistani time
 * @param utcString - UTC timestamp string from the server
 * @returns boolean indicating if the date is yesterday in PKT
 */
export const isYesterday = (utcString: string): boolean => {
  if (!utcString) return false;
  
  try {
    const date = new Date(utcString);
    const pktOffset = 5 * 60 * 60 * 1000;
    const pktTime = new Date(date.getTime() + pktOffset);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return (
      pktTime.getDate() === yesterday.getDate() &&
      pktTime.getMonth() === yesterday.getMonth() &&
      pktTime.getFullYear() === yesterday.getFullYear()
    );
  } catch (error) {
    console.error('Error checking if date is yesterday:', error);
    return false;
  }
};

/**
 * Gets the relative time display (Today, Yesterday, or full date)
 * @param utcString - UTC timestamp string from the server
 * @returns Formatted relative time string
 */
export const getRelativeTime = (utcString: string): string => {
  if (!utcString) return '';
  
  if (isToday(utcString)) {
    return `Today at ${formatToPakistaniTime(utcString)}`;
  } else if (isYesterday(utcString)) {
    return `Yesterday at ${formatToPakistaniTime(utcString)}`;
  } else {
    return formatToPakistaniDateTime(utcString);
  }
};