const request = require('supertest');
const mongoose = require('mongoose');
const express = require('express');
const requestRouter = require('../routes/request');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const sendEmail = require('../utils/sendEmail');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
jest.mock('../utils/sendEmail');

const app = express();
app.use(express.json());

// Mock auth middleware with actual user
let mockUser;
jest.mock('../middlewares/auth', () => ({
  userAuth: (req, res, next) => {
    req.user = mockUser;
    next();
  }
}));

app.use(requestRouter);

describe('Request Router - Integration Tests', () => {
  let fromUser, toUser;

  beforeAll(async () => {
    // Connect to test database
    mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
  });

  afterAll(async () => {
     await mongoose.disconnect();
  await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear collections
    await User.deleteMany({});
    await ConnectionRequest.deleteMany({});

    // Create test users
    fromUser = await User.create({
      firstName: 'Bobby',
      lastName: 'Johnson',
      email: 'bobby.johnson@example.com',
      password: 'Password123@'
    });

    toUser = await User.create({
      firstName: 'Janee',
      lastName: 'Smith',
      email: 'janee.smith@example.com',
      password: 'Password123@'
    });

    mockUser = fromUser;
    sendEmail.run.mockResolvedValue('Email sent');
  });

  afterEach(async () => {
    await User.deleteMany({});
    await ConnectionRequest.deleteMany({});
    jest.clearAllMocks();
  });

  describe('POST /request/send/:status/:toUserId', () => {
    it('should create a new connection request in database', async () => {
      const response = await request(app)
        .post(`/request/send/interested/${toUser._id}`)
        .expect(200);

      expect(response.body.message).toContain('Bobby');
      expect(response.body.message).toContain('interested');
      expect(response.body.data).toBeDefined();

      // Verify in database
      const savedRequest = await ConnectionRequest.findById(response.body.data._id);
      expect(savedRequest).toBeDefined();
      expect(savedRequest.fromUserId.toString()).toBe(fromUser._id.toString());
      expect(savedRequest.toUserId.toString()).toBe(toUser._id.toString());
      expect(savedRequest.status).toBe('interested');
    });

    it('should prevent duplicate connection requests', async () => {
      // Create first request
      await ConnectionRequest.create({
        fromUserId: fromUser._id,
        toUserId: toUser._id,
        status: 'interested'
      });

      // Try to create duplicate
      const response = await request(app)
        .post(`/request/send/interested/${toUser._id}`)
        .expect(400);

      expect(response.body.message).toBe('Connection request already exists between these two users');

      // Verify only one request exists
      const count = await ConnectionRequest.countDocuments({
        $or: [
          { fromUserId: fromUser._id, toUserId: toUser._id },
          { fromUserId: toUser._id, toUserId: fromUser._id }
        ]
      });
      expect(count).toBe(1);
    });

    it('should detect reverse connection requests', async () => {
      // Create request from toUser to fromUser
      await ConnectionRequest.create({
        fromUserId: toUser._id,
        toUserId: fromUser._id,
        status: 'interested'
      });

      // Try to create reverse request
      const response = await request(app)
        .post(`/request/send/interested/${toUser._id}`)
        .expect(400);

      expect(response.body.message).toBe('Connection request already exists between these two users');
    });

    it('should handle ignored status', async () => {
      const response = await request(app)
        .post(`/request/send/ignored/${toUser._id}`)
        .expect(200);

      const savedRequest = await ConnectionRequest.findById(response.body.data._id);
      expect(savedRequest.status).toBe('ignored');
    });
  });

  describe('POST /request/review/:status/:requestId', () => {
    let connectionRequest;

    beforeEach(async () => {
      // Create a connection request to review
      connectionRequest = await ConnectionRequest.create({
        fromUserId: toUser._id,
        toUserId: fromUser._id,
        status: 'interested'
      });
    });

    it('should accept a connection request and update in database', async () => {
      const response = await request(app)
        .post(`/request/review/accepted/${connectionRequest._id}`)
        .expect(200);

      expect(response.body.message).toBe('Connection request accepted successfully');

      // Verify in database
      const updatedRequest = await ConnectionRequest.findById(connectionRequest._id);
      expect(updatedRequest.status).toBe('accepted');
    });

    it('should reject a connection request and update in database', async () => {
      const response = await request(app)
        .post(`/request/review/rejected/${connectionRequest._id}`)
        .expect(200);

      expect(response.body.message).toBe('Connection request rejected successfully');

      // Verify in database
      const updatedRequest = await ConnectionRequest.findById(connectionRequest._id);
      expect(updatedRequest.status).toBe('rejected');
    });

    it('should not allow reviewing requests not addressed to user', async () => {
      // Create a request between other users
      const anotherUser = await User.create({
        firstName: 'Charlie',
        lastName: 'Brown',
        email: 'charlie.brown@example.com',
        password: 'Password123@'
      });

      const otherRequest = await ConnectionRequest.create({
        fromUserId: toUser._id,
        toUserId: anotherUser._id,
        status: 'interested'
      });

      const response = await request(app)
        .post(`/request/review/accepted/${otherRequest._id}`)
        .expect(404);

      expect(response.body.message).toBe('connection request not found');
    });

    it('should only allow reviewing requests with interested status', async () => {
      // Create already accepted request
      const acceptedRequest = await ConnectionRequest.create({
        fromUserId: toUser._id,
        toUserId: fromUser._id,
        status: 'accepted'
      });

      const response = await request(app)
        .post(`/request/review/rejected/${acceptedRequest._id}`)
        .expect(404);

      expect(response.body.message).toBe('connection request not found');
    });
  });
});
