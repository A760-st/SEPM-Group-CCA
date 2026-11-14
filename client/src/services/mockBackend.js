/**
 * Stateful Mock REST Backend
 * Simulates the Layered Monolithic Express + PostgreSQL REST API in the browser.
 * Persists data to localStorage so all user actions (create event, register, cancel, update)
 * work dynamically and persist across page navigations.
 */

import {
  INITIAL_USERS,
  INITIAL_VENUES,
  INITIAL_EVENTS,
  INITIAL_REGISTRATIONS,
  INITIAL_CERTIFICATES,
  INITIAL_NOTIFICATIONS,
} from './mockData';

const STORAGE_KEY = 'sepm_college_events_mock_db_v1';

class MockBackend {
  constructor() {
    this.initDatabase();
  }

  initDatabase(forceReset = false) {
    if (forceReset || !localStorage.getItem(STORAGE_KEY)) {
      const db = {
        users: [...INITIAL_USERS],
        venues: [...INITIAL_VENUES],
        events: [...INITIAL_EVENTS],
        registrations: [...INITIAL_REGISTRATIONS],
        certificates: [...INITIAL_CERTIFICATES],
        notifications: [...INITIAL_NOTIFICATIONS],
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    }
  }

  getDb() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.initDatabase(true);
        return JSON.parse(localStorage.getItem(STORAGE_KEY));
      }
      return JSON.parse(raw);
    } catch {
      this.initDatabase(true);
      return JSON.parse(localStorage.getItem(STORAGE_KEY));
    }
  }

  saveDb(db) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  }

  // Realistic artificial latency
  async delay(ms = 120) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // --- AUTHENTICATION APIS ---
  async login(email, password) {
    await this.delay();
    const db = this.getDb();
    const user = db.users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!user) {
      const error = new Error('Invalid email or password. Please check your credentials.');
      error.status = 401;
      throw error;
    }

    if (user.status === 'INACTIVE') {
      const error = new Error('This account has been deactivated by an administrator.');
      error.status = 403;
      throw error;
    }

    // Demo password check: accept "password123" or any password in mock mode
    // (Never return password_hash)
    const token = `mock-jwt-token-${user.id}-${Date.now()}`;
    return {
      success: true,
      token,
      user: { ...user },
    };
  }

  async registerStudent(studentData) {
    await this.delay();
    const db = this.getDb();

    // Check if email already exists
    const existing = db.users.find(
      (u) => u.email.toLowerCase() === studentData.email.trim().toLowerCase()
    );
    if (existing) {
      const error = new Error('An account with this college email already exists.');
      error.status = 400;
      throw error;
    }

    // Check student ID uniqueness
    if (studentData.student_id_number) {
      const idExists = db.users.find(
        (u) => u.student_id_number?.toLowerCase() === studentData.student_id_number.trim().toLowerCase()
      );
      if (idExists) {
        const error = new Error('This Student ID number is already registered.');
        error.status = 400;
        throw error;
      }
    }

    // Per rules: Backend determines role as STUDENT for public registration
    const newUser = {
      id: `u-${Date.now()}`,
      name: studentData.name.trim(),
      email: studentData.email.trim().toLowerCase(),
      student_id_number: studentData.student_id_number ? studentData.student_id_number.trim().toUpperCase() : `STU-${Date.now().toString().slice(-4)}`,
      role: 'STUDENT',
      department: studentData.department || 'Computer Science & Engineering',
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    };

    db.users.push(newUser);
    this.saveDb(db);

    const token = `mock-jwt-token-${newUser.id}-${Date.now()}`;
    return {
      success: true,
      token,
      user: newUser,
      message: 'Student account registered successfully.',
    };
  }

  async getCurrentUser(userId) {
    await this.delay(50);
    const db = this.getDb();
    const user = db.users.find((u) => u.id === userId);
    if (!user) {
      const error = new Error('User session not found.');
      error.status = 401;
      throw error;
    }
    return { success: true, user };
  }

  // --- USERS APIS ---
  async getUsers(params = {}) {
    await this.delay();
    const db = this.getDb();
    let users = [...db.users];

    if (params.role) {
      users = users.filter((u) => u.role === params.role);
    }
    if (params.search) {
      const q = params.search.toLowerCase();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.student_id_number && u.student_id_number.toLowerCase().includes(q)) ||
          (u.department && u.department.toLowerCase().includes(q))
      );
    }
    if (params.department) {
      users = users.filter((u) => u.department === params.department);
    }

    return {
      success: true,
      data: users,
      total: users.length,
    };
  }

  async createUser(userData) {
    await this.delay();
    const db = this.getDb();

    const existing = db.users.find(
      (u) => u.email.toLowerCase() === userData.email.trim().toLowerCase()
    );
    if (existing) {
      const err = new Error('User with this email already exists.');
      err.status = 400;
      throw err;
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      student_id_number: userData.student_id_number || null,
      role: userData.role || 'STUDENT',
      department: userData.department,
      status: 'ACTIVE',
      created_at: new Date().toISOString(),
    };

    db.users.push(newUser);
    this.saveDb(db);
    return { success: true, data: newUser, message: 'User created successfully.' };
  }

  async updateUser(id, updateData) {
    await this.delay();
    const db = this.getDb();
    const index = db.users.findIndex((u) => u.id === id);
    if (index === -1) {
      const err = new Error('User not found.');
      err.status = 404;
      throw err;
    }

    db.users[index] = {
      ...db.users[index],
      ...updateData,
    };
    this.saveDb(db);
    return { success: true, data: db.users[index], message: 'User updated successfully.' };
  }

  async updateUserRole(id, newRole) {
    await this.delay();
    const db = this.getDb();
    const user = db.users.find((u) => u.id === id);
    if (!user) {
      const err = new Error('User not found.');
      err.status = 404;
      throw err;
    }
    user.role = newRole;
    this.saveDb(db);
    return { success: true, data: user, message: `Role updated to ${newRole}.` };
  }

  async toggleUserStatus(id) {
    await this.delay();
    const db = this.getDb();
    const user = db.users.find((u) => u.id === id);
    if (!user) {
      const err = new Error('User not found.');
      err.status = 404;
      throw err;
    }
    user.status = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.saveDb(db);
    return { success: true, data: user, message: `User status changed to ${user.status}.` };
  }

  // --- VENUES APIS ---
  async getVenues() {
    await this.delay();
    const db = this.getDb();
    return {
      success: true,
      data: db.venues,
      total: db.venues.length,
    };
  }

  async createVenue(venueData) {
    await this.delay();
    const db = this.getDb();
    const newVenue = {
      id: `v-${Date.now()}`,
      name: venueData.name,
      location: venueData.location,
      capacity: parseInt(venueData.capacity, 10) || 50,
      status: 'ACTIVE',
    };
    db.venues.push(newVenue);
    this.saveDb(db);
    return { success: true, data: newVenue, message: 'Venue created successfully.' };
  }

  async updateVenue(id, venueData) {
    await this.delay();
    const db = this.getDb();
    const index = db.venues.findIndex((v) => v.id === id);
    if (index === -1) {
      const err = new Error('Venue not found.');
      err.status = 404;
      throw err;
    }
    db.venues[index] = {
      ...db.venues[index],
      ...venueData,
      capacity: parseInt(venueData.capacity, 10) || db.venues[index].capacity,
    };
    this.saveDb(db);
    return { success: true, data: db.venues[index], message: 'Venue updated successfully.' };
  }

  async toggleVenueStatus(id) {
    await this.delay();
    const db = this.getDb();
    const venue = db.venues.find((v) => v.id === id);
    if (!venue) {
      const err = new Error('Venue not found.');
      err.status = 404;
      throw err;
    }
    venue.status = venue.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    this.saveDb(db);
    return { success: true, data: venue, message: `Venue marked ${venue.status}.` };
  }

  // --- EVENTS APIS ---
  async getEvents(params = {}) {
    await this.delay();
    const db = this.getDb();
    let events = [...db.events];

    // Filter by organizer if specified
    if (params.organizer_id) {
      events = events.filter((e) => e.organizer_id === params.organizer_id);
    }

    // Filter by status
    if (params.status && params.status !== 'ALL') {
      events = events.filter((e) => e.status === params.status);
    }

    // Filter by category
    if (params.category && params.category !== 'ALL') {
      events = events.filter((e) => e.category === params.category);
    }

    // Filter by venue
    if (params.venue_id && params.venue_id !== 'ALL') {
      events = events.filter((e) => e.venue_id === params.venue_id);
    }

    // Filter by search query
    if (params.search) {
      const q = params.search.toLowerCase();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }

    // Attach relational details: Venue, Organizer, Registration count
    const enrichedEvents = events.map((event) => {
      const venue = db.venues.find((v) => v.id === event.venue_id);
      const organizer = db.users.find((u) => u.id === event.organizer_id);
      const activeRegistrations = db.registrations.filter(
        (r) => r.event_id === event.id && r.status !== 'CANCELLED'
      );
      const registeredCount = activeRegistrations.length;
      const availableSeats = Math.max(0, event.max_participants - registeredCount);

      return {
        ...event,
        venue: venue || null,
        organizer: organizer ? { id: organizer.id, name: organizer.name, email: organizer.email } : null,
        registered_count: registeredCount,
        available_seats: availableSeats,
        is_full: availableSeats === 0,
      };
    });

    // Sorting
    if (params.sortBy === 'date') {
      enrichedEvents.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));
    } else if (params.sortBy === 'popularity') {
      enrichedEvents.sort((a, b) => b.registered_count - a.registered_count);
    } else if (params.sortBy === 'title') {
      enrichedEvents.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      // Default: newly created first
      enrichedEvents.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return {
      success: true,
      data: enrichedEvents,
      total: enrichedEvents.length,
    };
  }

  async getEventById(id) {
    await this.delay();
    const db = this.getDb();
    const event = db.events.find((e) => e.id === id);
    if (!event) {
      const err = new Error('Event not found.');
      err.status = 404;
      throw err;
    }

    const venue = db.venues.find((v) => v.id === event.venue_id);
    const organizer = db.users.find((u) => u.id === event.organizer_id);
    const activeRegistrations = db.registrations.filter(
      (r) => r.event_id === event.id && r.status !== 'CANCELLED'
    );
    const registeredCount = activeRegistrations.length;
    const availableSeats = Math.max(0, event.max_participants - registeredCount);

    return {
      success: true,
      data: {
        ...event,
        venue: venue || null,
        organizer: organizer ? { id: organizer.id, name: organizer.name, email: organizer.email, department: organizer.department } : null,
        registered_count: registeredCount,
        available_seats: availableSeats,
        is_full: availableSeats === 0,
      },
    };
  }

  async createEvent(eventData, organizerId) {
    await this.delay();
    const db = this.getDb();

    // Venue capacity validation
    const venue = db.venues.find((v) => v.id === eventData.venue_id);
    const maxParticipants = parseInt(eventData.max_participants, 10);
    if (venue && maxParticipants > venue.capacity) {
      const err = new Error(`Maximum participants (${maxParticipants}) cannot exceed venue capacity (${venue.capacity}).`);
      err.status = 400;
      throw err;
    }

    const newEvent = {
      id: `e-${Date.now()}`,
      title: eventData.title.trim(),
      description: eventData.description.trim(),
      organizer_id: organizerId || eventData.organizer_id,
      venue_id: eventData.venue_id,
      category: eventData.category || 'Technical & Coding',
      start_time: eventData.start_time,
      end_time: eventData.end_time,
      registration_deadline: eventData.registration_deadline,
      max_participants: maxParticipants,
      status: eventData.status || 'DRAFT',
      cancel_reason: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    db.events.push(newEvent);
    this.saveDb(db);
    return { success: true, data: newEvent, message: 'Event created successfully.' };
  }

  async updateEvent(id, eventData) {
    await this.delay();
    const db = this.getDb();
    const index = db.events.findIndex((e) => e.id === id);
    if (index === -1) {
      const err = new Error('Event not found.');
      err.status = 404;
      throw err;
    }

    if (eventData.venue_id && eventData.max_participants) {
      const venue = db.venues.find((v) => v.id === eventData.venue_id);
      const maxParticipants = parseInt(eventData.max_participants, 10);
      if (venue && maxParticipants > venue.capacity) {
        const err = new Error(`Maximum participants (${maxParticipants}) cannot exceed venue capacity (${venue.capacity}).`);
        err.status = 400;
        throw err;
      }
    }

    db.events[index] = {
      ...db.events[index],
      ...eventData,
      max_participants: eventData.max_participants ? parseInt(eventData.max_participants, 10) : db.events[index].max_participants,
      updated_at: new Date().toISOString(),
    };

    this.saveDb(db);
    return { success: true, data: db.events[index], message: 'Event updated successfully.' };
  }

  async publishEvent(id) {
    await this.delay();
    const db = this.getDb();
    const event = db.events.find((e) => e.id === id);
    if (!event) {
      const err = new Error('Event not found.');
      err.status = 404;
      throw err;
    }
    event.status = 'PUBLISHED';
    event.updated_at = new Date().toISOString();
    this.saveDb(db);
    return { success: true, data: event, message: 'Event has been published.' };
  }

  async cancelEvent(id, cancelReason) {
    await this.delay();
    const db = this.getDb();
    const event = db.events.find((e) => e.id === id);
    if (!event) {
      const err = new Error('Event not found.');
      err.status = 404;
      throw err;
    }
    event.status = 'CANCELLED';
    event.cancel_reason = cancelReason || 'Cancelled by organizer';
    event.updated_at = new Date().toISOString();

    // Update active registrations
    db.registrations = db.registrations.map((r) => {
      if (r.event_id === id && r.status === 'CONFIRMED') {
        return { ...r, status: 'CANCELLED' };
      }
      return r;
    });

    this.saveDb(db);
    return { success: true, data: event, message: 'Event has been cancelled.' };
  }

  async deleteEvent(id) {
    await this.delay();
    const db = this.getDb();
    const index = db.events.findIndex((e) => e.id === id);
    if (index === -1) {
      const err = new Error('Event not found.');
      err.status = 404;
      throw err;
    }
    db.events.splice(index, 1);
    this.saveDb(db);
    return { success: true, message: 'Event deleted successfully.' };
  }

  // --- REGISTRATIONS APIS ---
  async getRegistrations(params = {}) {
    await this.delay();
    const db = this.getDb();
    let registrations = [...db.registrations];

    if (params.student_id) {
      registrations = registrations.filter((r) => r.student_id === params.student_id);
    }
    if (params.event_id) {
      registrations = registrations.filter((r) => r.event_id === params.event_id);
    }
    if (params.status && params.status !== 'ALL') {
      registrations = registrations.filter((r) => r.status === params.status);
    }

    const enriched = registrations.map((reg) => {
      const event = db.events.find((e) => e.id === reg.event_id);
      const student = db.users.find((u) => u.id === reg.student_id);
      const venue = event ? db.venues.find((v) => v.id === event.venue_id) : null;
      const certificate = db.certificates.find((c) => c.registration_id === reg.id);

      return {
        ...reg,
        event: event ? { ...event, venue } : null,
        student: student ? { id: student.id, name: student.name, email: student.email, student_id_number: student.student_id_number, department: student.department } : null,
        certificate: certificate || null,
      };
    });

    return {
      success: true,
      data: enriched,
      total: enriched.length,
    };
  }

  async registerForEvent(eventId, studentId) {
    await this.delay();
    const db = this.getDb();

    const event = db.events.find((e) => e.id === eventId);
    if (!event) {
      const err = new Error('Event not found.');
      err.status = 404;
      throw err;
    }

    if (event.status !== 'PUBLISHED') {
      const err = new Error('Registration is not open for this event.');
      err.status = 400;
      throw err;
    }

    // Check deadline
    if (new Date(event.registration_deadline) < new Date()) {
      const err = new Error('The registration deadline for this event has passed.');
      err.status = 400;
      throw err;
    }

    // Check existing registration
    const existing = db.registrations.find(
      (r) => r.event_id === eventId && r.student_id === studentId
    );
    if (existing) {
      if (existing.status === 'CONFIRMED') {
        const err = new Error('You are already registered for this event.');
        err.status = 400;
        throw err;
      } else if (existing.status === 'CANCELLED') {
        // Re-activate
        existing.status = 'CONFIRMED';
        existing.registered_at = new Date().toISOString();
        this.saveDb(db);
        return { success: true, data: existing, message: 'Your registration has been reinstated!' };
      }
    }

    // Check capacity
    const activeCount = db.registrations.filter(
      (r) => r.event_id === eventId && r.status !== 'CANCELLED'
    ).length;

    if (activeCount >= event.max_participants) {
      const err = new Error('Event is currently at maximum capacity. No seats available.');
      err.status = 400;
      throw err;
    }

    const newReg = {
      id: `r-${Date.now()}`,
      event_id: eventId,
      student_id: studentId,
      status: 'CONFIRMED',
      certificate_eligible: false,
      registered_at: new Date().toISOString(),
    };

    db.registrations.push(newReg);

    // Create notification
    db.notifications.unshift({
      id: `n-${Date.now()}`,
      userId: studentId,
      title: 'Registration Confirmed',
      message: `You are officially registered for "${event.title}".`,
      type: 'SUCCESS',
      read: false,
      created_at: new Date().toISOString(),
    });

    this.saveDb(db);
    return { success: true, data: newReg, message: 'Successfully registered for the event!' };
  }

  async cancelRegistration(registrationId, studentId) {
    await this.delay();
    const db = this.getDb();
    const reg = db.registrations.find((r) => r.id === registrationId);
    if (!reg) {
      const err = new Error('Registration record not found.');
      err.status = 404;
      throw err;
    }

    if (studentId && reg.student_id !== studentId) {
      const err = new Error('Unauthorized to cancel this registration.');
      err.status = 403;
      throw err;
    }

    reg.status = 'CANCELLED';
    this.saveDb(db);
    return { success: true, data: reg, message: 'Registration has been cancelled.' };
  }

  async markAttendance(registrationId, attended = true) {
    await this.delay();
    const db = this.getDb();
    const reg = db.registrations.find((r) => r.id === registrationId);
    if (!reg) {
      const err = new Error('Registration record not found.');
      err.status = 404;
      throw err;
    }
    reg.status = attended ? 'ATTENDED' : 'CONFIRMED';
    reg.certificate_eligible = attended;
    this.saveDb(db);
    return { success: true, data: reg, message: `Attendance marked as ${reg.status}.` };
  }

  // --- CERTIFICATES APIS ---
  async getCertificates(params = {}) {
    await this.delay();
    const db = this.getDb();
    let certs = [...db.certificates];

    const enriched = certs.map((cert) => {
      const registration = db.registrations.find((r) => r.id === cert.registration_id);
      const student = registration ? db.users.find((u) => u.id === registration.student_id) : null;
      const event = registration ? db.events.find((e) => e.id === registration.event_id) : null;
      const issuer = db.users.find((u) => u.id === cert.issued_by);

      return {
        ...cert,
        registration,
        student: student ? { id: student.id, name: student.name, email: student.email, student_id_number: student.student_id_number, department: student.department } : null,
        event: event ? { id: event.id, title: event.title, start_time: event.start_time, end_time: event.end_time } : null,
        issuer: issuer ? { id: issuer.id, name: issuer.name, role: issuer.role } : null,
      };
    });

    if (params.student_id) {
      return {
        success: true,
        data: enriched.filter((c) => c.student?.id === params.student_id),
      };
    }

    return {
      success: true,
      data: enriched,
      total: enriched.length,
    };
  }

  async issueCertificate(registrationId, issuedByUserId) {
    await this.delay();
    const db = this.getDb();

    const reg = db.registrations.find((r) => r.id === registrationId);
    if (!reg) {
      const err = new Error('Registration not found.');
      err.status = 404;
      throw err;
    }

    // Check if certificate already issued
    const existing = db.certificates.find((c) => c.registration_id === registrationId);
    if (existing) {
      const err = new Error('Certificate has already been issued for this registration.');
      err.status = 400;
      throw err;
    }

    const certYear = new Date().getFullYear();
    const certNum = `AIT-CERT-${certYear}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newCert = {
      id: `c-${Date.now()}`,
      registration_id: registrationId,
      certificate_no: certNum,
      file_path: `/certificates/${certNum}.pdf`,
      issued_at: new Date().toISOString(),
      issued_by: issuedByUserId || 'u-3',
    };

    reg.certificate_eligible = true;
    db.certificates.push(newCert);

    // Notify student
    db.notifications.unshift({
      id: `n-${Date.now()}`,
      userId: reg.student_id,
      title: 'New Certificate Available',
      message: `Your certificate ${certNum} has been officially issued.`,
      type: 'INFO',
      read: false,
      created_at: new Date().toISOString(),
    });

    this.saveDb(db);
    return { success: true, data: newCert, message: `Certificate ${certNum} issued successfully.` };
  }

  // --- NOTIFICATIONS APIS ---
  async getNotifications(userId) {
    await this.delay(50);
    const db = this.getDb();
    const userNotifications = db.notifications.filter(
      (n) => n.userId === userId || n.userId === 'all'
    );
    return {
      success: true,
      data: userNotifications,
      unreadCount: userNotifications.filter((n) => !n.read).length,
    };
  }

  async markNotificationRead(id) {
    const db = this.getDb();
    const notif = db.notifications.find((n) => n.id === id);
    if (notif) notif.read = true;
    this.saveDb(db);
    return { success: true };
  }

  // --- REPORTS & ANALYTICS APIS ---
  async getDashboardStats() {
    await this.delay();
    const db = this.getDb();

    const students = db.users.filter((u) => u.role === 'STUDENT').length;
    const organizers = db.users.filter((u) => u.role === 'ORGANIZER').length;
    const admins = db.users.filter((u) => u.role === 'ADMIN').length;

    const publishedEvents = db.events.filter((e) => e.status === 'PUBLISHED').length;
    const draftEvents = db.events.filter((e) => e.status === 'DRAFT').length;
    const completedEvents = db.events.filter((e) => e.status === 'COMPLETED').length;
    const cancelledEvents = db.events.filter((e) => e.status === 'CANCELLED').length;

    const totalRegistrations = db.registrations.length;
    const activeRegistrations = db.registrations.filter((r) => r.status === 'CONFIRMED').length;
    const attendedRegistrations = db.registrations.filter((r) => r.status === 'ATTENDED').length;
    const totalCertificates = db.certificates.length;

    return {
      success: true,
      data: {
        users: {
          total: db.users.length,
          students,
          organizers,
          admins,
        },
        events: {
          total: db.events.length,
          published: publishedEvents,
          draft: draftEvents,
          completed: completedEvents,
          cancelled: cancelledEvents,
        },
        registrations: {
          total: totalRegistrations,
          confirmed: activeRegistrations,
          attended: attendedRegistrations,
        },
        certificates: {
          total: totalCertificates,
        },
        venues: {
          total: db.venues.length,
          active: db.venues.filter((v) => v.status === 'ACTIVE').length,
        },
      },
    };
  }

  async getAnalyticsReports() {
    await this.delay();
    const db = this.getDb();

    // Events by Status
    const eventsByStatus = [
      { name: 'Published', value: db.events.filter((e) => e.status === 'PUBLISHED').length, color: '#10b981' },
      { name: 'Draft', value: db.events.filter((e) => e.status === 'DRAFT').length, color: '#f59e0b' },
      { name: 'Completed', value: db.events.filter((e) => e.status === 'COMPLETED').length, color: '#3b82f6' },
      { name: 'Cancelled', value: db.events.filter((e) => e.status === 'CANCELLED').length, color: '#ef4444' },
    ];

    // Registrations over time (monthly grouping)
    const registrationsOverTime = [
      { month: 'Jun', count: 18 },
      { month: 'Jul', count: 24 },
      { month: 'Aug', count: 45 },
      { month: 'Sep', count: 68 },
      { month: 'Oct', count: 95 },
      { month: 'Nov', count: 124 },
    ];

    // Popular events ranking
    const popularEvents = db.events.map((e) => {
      const count = db.registrations.filter((r) => r.event_id === e.id && r.status !== 'CANCELLED').length;
      return {
        name: e.title.length > 25 ? e.title.slice(0, 22) + '...' : e.title,
        registrations: count,
        capacity: e.max_participants,
      };
    }).sort((a, b) => b.registrations - a.registrations).slice(0, 5);

    // Department user distribution
    const departmentDistribution = [
      { dept: 'Computer Science', count: 2 },
      { dept: 'Info Tech', count: 1 },
      { dept: 'Electronics', count: 1 },
      { dept: 'Mechanical', count: 1 },
      { dept: 'Biotechnology', count: 1 },
    ];

    // Venue utilization
    const venueUtilization = db.venues.map((v) => {
      const venueEvents = db.events.filter((e) => e.venue_id === v.id);
      const totalCapacity = v.capacity * (venueEvents.length || 1);
      const booked = venueEvents.reduce((acc, ev) => {
        const count = db.registrations.filter((r) => r.event_id === ev.id && r.status !== 'CANCELLED').length;
        return acc + count;
      }, 0);
      const rate = totalCapacity > 0 ? Math.min(100, Math.round((booked / totalCapacity) * 100)) : 0;
      return {
        name: v.name.length > 20 ? v.name.slice(0, 18) + '...' : v.name,
        capacity: v.capacity,
        rate,
      };
    });

    return {
      success: true,
      data: {
        eventsByStatus,
        registrationsOverTime,
        popularEvents,
        departmentDistribution,
        venueUtilization,
      },
    };
  }

  // Reset database to initial seed data
  reset() {
    this.initDatabase(true);
    return { success: true, message: 'Database reset to initial mock data.' };
  }
}

export const mockBackend = new MockBackend();
