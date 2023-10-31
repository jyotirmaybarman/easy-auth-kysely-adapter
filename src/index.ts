import { DatabaseAdapterInterface } from "./interfaces/database-adapter.interface";
import { CreateUserType } from "./types/create-user.type";
import { UserType } from "./types/user.type";

export class YourAdapter implements DatabaseAdapterInterface{

    createUser(data: CreateUserType): Promise<UserType> {
        throw new Error("method not implemented");
    }
    
    deleteUser(filter: Partial<UserType>): Promise<UserType> {
        throw new Error("method not implemented");
    }

    findUser(filter: Partial<UserType>, select?: (keyof UserType)[] | undefined): Promise<UserType | undefined> {
        throw new Error("method not implemented");
    }

    updateUser(filter: Partial<UserType>, data: Partial<UserType>): Promise<UserType> {
        throw new Error("method not implemented");
    }
}