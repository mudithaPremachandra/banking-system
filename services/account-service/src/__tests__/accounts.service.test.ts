import * as accountsRepository from "../repositories/accounts.repository";
import { getOrCreateAccount, getBalance } from "../services/accounts.service";

jest.mock("../repositories/accounts.repository");

describe("accounts.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getOrCreateAccount", () => {
    it("returns existing account if found", async () => {
      const existingAccount = {
        id: "acc-1",
        userId: "user-1",
        accountNumber: "ACC1234567890",
        balance: 100,
        currency: "LKR",
      };

      (accountsRepository.findByUserId as jest.Mock).mockResolvedValue(existingAccount);
      (accountsRepository.create as jest.Mock).mockResolvedValue(null);

      const result = await getOrCreateAccount("user-1");

      expect(accountsRepository.findByUserId).toHaveBeenCalledWith("user-1");
      expect(accountsRepository.create).not.toHaveBeenCalled();
      expect(result).toEqual(existingAccount);
    });

    it("creates account if none exists", async () => {
      const createdAccount = {
        id: "acc-2",
        userId: "user-2",
        accountNumber: "ACC1234567890",
        balance: 0,
        currency: "LKR",
      };

      (accountsRepository.findByUserId as jest.Mock).mockResolvedValue(null);
      (accountsRepository.create as jest.Mock).mockResolvedValue(createdAccount);

      const result = await getOrCreateAccount("user-2");

      expect(accountsRepository.findByUserId).toHaveBeenCalledWith("user-2");
      expect(accountsRepository.create).toHaveBeenCalledTimes(1);
      expect(accountsRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: "user-2",
          accountNumber: expect.stringMatching(/^ACC\d{10}$/),
        })
      );
      expect(result).toEqual(createdAccount);
    });

    it("retries when create fails with P2002 and then succeeds", async () => {
      const createdAccount = {
        id: "acc-3",
        userId: "user-3",
        accountNumber: "ACC9999999999",
        balance: 0,
        currency: "LKR",
      };

      (accountsRepository.findByUserId as jest.Mock).mockResolvedValue(null);
      (accountsRepository.create as jest.Mock)
        .mockRejectedValueOnce({ code: "P2002" })
        .mockResolvedValueOnce(createdAccount);

      const result = await getOrCreateAccount("user-3");

      expect(accountsRepository.create).toHaveBeenCalledTimes(2);
      expect(result).toEqual(createdAccount);
    });

    it("throws non-P2002 errors immediately", async () => {
      const dbError = { code: "DB_ERROR", message: "Database down" };

      (accountsRepository.findByUserId as jest.Mock).mockResolvedValue(null);
      (accountsRepository.create as jest.Mock).mockRejectedValue(dbError);

      await expect(getOrCreateAccount("user-4")).rejects.toEqual(dbError);

      expect(accountsRepository.create).toHaveBeenCalledTimes(1);
    });

    it("throws after 5 P2002 failures", async () => {
      (accountsRepository.findByUserId as jest.Mock).mockResolvedValue(null);
      (accountsRepository.create as jest.Mock).mockRejectedValue({ code: "P2002" });

      await expect(getOrCreateAccount("user-5")).rejects.toThrow(
        "Failed to generate unique account number"
      );

      expect(accountsRepository.create).toHaveBeenCalledTimes(5);
    });
  });

  describe("getBalance", () => {
    it("returns numeric balance and currency for existing account", async () => {
      const existingAccount = {
        id: "acc-6",
        userId: "user-6",
        accountNumber: "ACC1231231231",
        balance: "250.50",
        currency: "LKR",
      };

      (accountsRepository.findByUserId as jest.Mock).mockResolvedValue(existingAccount);

      const result = await getBalance("user-6");

      expect(result).toEqual({
        balance: 250.5,
        currency: "LKR",
      });
    });

    it("creates account if none exists and returns its balance and currency", async () => {
      const createdAccount = {
        id: "acc-7",
        userId: "user-7",
        accountNumber: "ACC1111111111",
        balance: 0,
        currency: "LKR",
      };

      (accountsRepository.findByUserId as jest.Mock).mockResolvedValue(null);
      (accountsRepository.create as jest.Mock).mockResolvedValue(createdAccount);

      const result = await getBalance("user-7");

      expect(accountsRepository.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual({
        balance: 0,
        currency: "LKR",
      });
    });
  });
});