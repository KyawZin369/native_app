import { gql } from "@apollo/client";

type PetData = {
  id: string;
  name: string;
  type: string;
  breed: string;
  age: number;
};

export const AddPetData = gql`
  mutation AddPet($petToAdd: PetToAdd!) {
    addPet(petToAdd: $petToAdd) {
      id
      name
      type
      age
      breed
    }
  }
`;

export const GET_PETS = gql`
  query GetPets {
    pets {
      id
      name
      type
      breed
      age
    }
  }
`;

export const DeletePets = gql`
  mutation DeletePet($id: ID!) {
    deletePet(id: $id) {
      id
      name
      type
      age
      breed
    }
  }
`;

export const EditPets = gql`
  mutation EditPet($petToEdit: PetToEdit!) {
    editPet(petToEdit: $petToEdit) {
      id
      name
      type
      age
      breed
    }
  }
`;

export type GetPetsResponse = {
  pets: PetData[];
};
