import { Types } from "mongoose";

declare namespace Bookables {
  type UserRole = "tenant" | "host";

  interface PayoutInformation {
    bic: string;
    iban: string;
    owner: string;
  }

  type PaymentProvider = {
    provider: "creditcard";
    cardnumber: number;
    validationNumber: number;
    owner: string;
    expiration: Date;
  };

  interface Email {
    address: string;
    isConfirmed: boolean;
  }
  interface User {
    _id: Types.ObjectId;
    email: Email;
    password: string;
    roles: UserRole[];
    paymentProviders?: PaymentProvider;
    payoutInformation?: PayoutInformation;
   
  }

  type ShareableUser = Pick<User, "email" | "roles" | "_id">;

  interface Tenant extends User {
    roles: ["tenant"];
    paymentProviders: [PaymentProvider];
  }

  interface Host extends User {
    roles: ["host"];
    payoutInformation: PayoutInformation;
  }

  export type BookableType = "seat" | "room";
  interface Bookable {
    _id: Types.ObjectId;
    spaceId: Types.ObjectId;
    name: string;
    type: BookableType;
    hourlyRate: number;
  }

  interface ContactInformation {
    email: string;
    phoneNumber?: string;
  }

  interface Address {
    _id: Types.ObjectId;
    addressLine: string;
    adminDistrict: string;
    adminDistrict2?: string;
    countryRegion: string;
    formattedAddress: string;
    locality: string;
    postalCode: string;
  }

  type Latitude = number;
  type Longitude = number;
  type Coordinates = [Longitude,Latitude];

  type Point = {
    type: "Point";
    coordinates: Coordinates;
  };
  interface Space {
    _id: Types.ObjectId;
    owner: Types.ObjectId; //Reference to Host
    name: string;
    description: string;
    address: Address;
    point: Point;
    bookables: Bookable[];
    contactInformation: ContactInformation;
  }

  type Reservation = {
    _id: Types.ObjectId | string;
    bookable: Types.ObjectId | string;
    from: Date;
    to: Date;
    user: Types.ObjectId | string;
  }

  type PopulatedReservation = {
    _id: Types.ObjectId | string;
    bookable: Omit<Bookables.Bookable,  "spaceId">  & { spaceId: Bookables.Space}
    from: Date;
    to: Date;
    user: Bookables.User;
  }

  type Location = {
  name: string;
  point: Bookables.Point;
  address: Partial<{
    addressLine: string;
    locality: string;
    neighborhood: string;
    adminDistrict: string;
    adminDistrict2: string;
    formattedAddress: string;
    postalCode: string;
    countryRegion: string;
    countryRegionIso2: string;
    landmark: string;
  }>;
  confidence: "Low" | "Medium" | "High"
};
}

export default Bookables;
