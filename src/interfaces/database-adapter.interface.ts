import { UserType } from "../types/user.type";
import { CreateUserType } from "../types/create-user.type";

export interface DatabaseAdapterInterface {
  /**
   * 
   * @param data 
   * It either creates a new user or throws an error
   * @returns user
   */
  createUser(data: CreateUserType): Promise<UserType>;

  /**
   * 
   * @param filter 
   * @param data 
   * It either updates an user data or throws an error
   * @returns user
   */
  updateUser(
    filter: Partial<UserType>,
    data: Partial<UserType>,
    options?: { filterType: "or" | "and" }
  ): Promise<UserType>;

  /**
   * 
   * @param filter 
   * It either deletes an user or throws an error
   * @returns user
   */
  deleteUser(filter: Partial<UserType>, options?: { filterType: "or" | "and" }): Promise<UserType>;

  /**
   * 
   * @param filter 
   * It either finds an user or returns null
   * @returns user | null
   */
  findUser(filter: Partial<UserType>, select?: (keyof UserType)[], options?: { filterType: "or" | "and" }): Promise<UserType | undefined>;
}
