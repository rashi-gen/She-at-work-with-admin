/**
 * Event details interface
 */

interface EventDetails {
  title: string;
  date: string;
  time?: string;
  location: string;
  format: string;
  price: string;
  category: string;
}

/**
 * Detects if the user is on a mobile device
 */
const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Generates a mailto link with pre-filled event registration details
 * @param event - Event object containing details
 * @returns mailto URL string
 */
export const generateMailtoLink = (event: EventDetails): string => {
  // Email recipient - replace with your actual registration email
  const recipientEmail = "events@yourorganization.com";
  
  // Email subject
  const subject = `Event Registration Request: ${event.title}`;
  
  // Email body
  const body = `Hello,

I would like to register for the following event:

Event Name: ${event.title}
Category: ${event.category}
Date: ${event.date}${event.time ? ` at ${event.time}` : ''}
Location: ${event.location}
Format: ${event.format}
Price: ${event.price}

Please confirm my registration and provide any additional details or requirements.

Thank you!

Best regards,`;

  // Encode the subject and body for URL
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  
  // Create mailto link
  return `mailto:${recipientEmail}?subject=${encodedSubject}&body=${encodedBody}`;
};

/**
 * Generates a Gmail compose URL with pre-filled event registration details
 * @param event - Event object containing details
 * @returns Gmail compose URL string
 */
export const generateGmailLink = (event: EventDetails): string => {
  // Email recipient - replace with your actual registration email
  const recipientEmail = "info@sheatwork.com";
  
  // Email subject
  const subject = `Event Information Request: ${event.title}`;
  
  // Email body (Gmail uses plain text, line breaks with %0A)
  const body = `Hello,

I would like to get information for the following event:

Event Name: ${event.title}
Category: ${event.category}

Thank you!

Best regards,`;

  // Encode the subject and body for URL
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  
  // Create Gmail compose link
  return `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=${encodedSubject}&body=${encodedBody}`;
};

/**
 * Opens the email client with pre-filled event details
 * On desktop: Opens Gmail in a new tab
 * On mobile: Uses mailto to open the default email app
 * @param event - Event object containing details
 */
export const openEventRegistrationEmail = (event: EventDetails): void => {
  if (isMobileDevice()) {
    // Mobile: Use mailto to open default email app
    const mailtoLink = generateMailtoLink(event);
    window.location.href = mailtoLink;
  } else {
    // Desktop: Open Gmail in new tab
    const gmailLink = generateGmailLink(event);
    window.open(gmailLink, '_blank');
  }
};