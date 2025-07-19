import request from "supertest";
import app from "../users/src/index";

jest.mock("../src/interfaces/repo", () => {
  const mockUserProvidedName = {
    id: "12345",
    username: "oatsmoothie",
    anonymous: true,
  };

  const mockUserRandomName = {
    id: "67890",
    username: "rand-name",
    anonymous: true,
  };

  return {
    PostgresUsersRepo: jest.fn().mockImplementation(() => ({
      create: jest.fn().mockImplementation((userData) => {
        if (userData.username === "rand-name") {
          return Promise.resolve(mockUserRandomName);
        }
        return Promise.resolve(mockUserProvidedName);
      }),
      getById: jest.fn().mockResolvedValue(mockUserProvidedName),
      getByUsername: jest.fn().mockResolvedValue(null),
    })),
    __mockUserProvidedName: mockUserProvidedName,
    __mockUserRandomName: mockUserRandomName,
  };
});

jest.mock("../src/business/service", () => {
  // import the actual UsersService implementation
  const actualService = jest.requireActual("../src/business/service");

  return {
    UsersService: jest.fn().mockImplementation(() => {
      // get the mock repo
      const MockRepo = jest.requireMock(
        "../src/interfaces/repo"
      ).PostgresUsersRepo;
      const mockUsersRepo = new MockRepo();

      // inherit the actual service, and only mock generateUsername
      const serviceInstance = new actualService.UsersService(mockUsersRepo);
      serviceInstance.generateUsername = jest
        .fn()
        .mockResolvedValue("rand-name");
      return serviceInstance;
    }),
  };
});

const { __mockUserProvidedName, __mockUserRandomName } = jest.requireMock(
  "../src/interfaces/repo"
);

// create user with username provided
describe("POST /api/v0/users", () => {
  it("it should return a new user", async () => {
    const requestBody = {
      username: "oatsmoothie",
      anonymous: true,
    };

    const res = await request(app).post("/api/v0/users").send(requestBody);
    console.log(res.body);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ user: __mockUserProvidedName });
  });
});

// create user without username, a username should be generated
describe("POST /api/v0/users", () => {
  it("it should return a new user with an assigned username 'rand-name'", async () => {
    const requestBody = {
      anonymous: true,
    };

    const res = await request(app).post("/api/v0/users").send(requestBody);
    console.log(res.body);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ user: __mockUserRandomName });
  });
});
