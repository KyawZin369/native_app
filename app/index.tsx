import React, { useEffect, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
  Pressable,
} from "react-native";
import { useMutation, useQuery } from "@apollo/client";
import {
  AddPetData,
  DeletePets,
  EditPets,
  GET_PETS,
  GetPetsResponse,
} from "../api/query";

const Home = () => {
  const [petNames, setPetNames] = useState<GetPetsResponse["pets"]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterPetName, setFilterPetName] = useState("");

  const { loading, error, data, refetch } = useQuery<GetPetsResponse>(GET_PETS);

  const [AddPet] = useMutation(AddPetData, { onCompleted: () => refetch() });
  const [deletePet] = useMutation(DeletePets, { onCompleted: () => refetch() });
  const [EditPet] = useMutation(EditPets, { onCompleted: () => refetch() });

  useEffect(() => {
    if (data) {
      setPetNames(data.pets);
    }
  }, [data]);

  const filteredPets = useMemo(() => {
    if (!filterPetName) return petNames;
    return petNames.filter((pet) =>
      pet.name.toLowerCase().includes(filterPetName.toLowerCase())
    );
  }, [filterPetName, petNames]);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error: {error.message}</Text>;

  const handleAddOrEditPet = () => {
    if (!name || !type || !breed || !age) {
      alert("Please fill in all fields.");
      return;
    }

    const petDetails = {
      name,
      type,
      breed,
      age: parseInt(age),
    };

    if (editingPetId) {
      EditPet({
        variables: {
          petToEdit: {
            id: editingPetId,
            ...petDetails,
          },
        },
      });
    } else {
      AddPet({ variables: { petToAdd: petDetails } });
    }

    // Reset input fields
    setName("");
    setType("");
    setBreed("");
    setAge("");
    setEditingPetId(null);
  };

  function handleDeletePet(petId: string) {
    if (!petId) {
      console.error("petId is required but not provided!");
      return;
    }

    deletePet({ variables: { id: petId } })
      .then(() => console.log("Pet deleted successfully"))
      .catch((error) => console.error("Error deleting pet:", error));
  }

  console.log("filter PetName" + filterPetName);
  console.log("filter PetName" + JSON.stringify(petNames, null, 2));

  return (
    <ScrollView>
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Type"
          value={type}
          onChangeText={setType}
        />
        <TextInput
          style={styles.input}
          placeholder="Breed"
          value={breed}
          onChangeText={setBreed}
        />
        <TextInput
          style={styles.input}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={handleAddOrEditPet}>
          <Text style={styles.buttonText}>
            {editingPetId ? "Edit Pet" : "Add Pet"}
          </Text>
        </TouchableOpacity>

        <TextInput
          style={styles.searchBar}
          placeholder="Search Pet Name..."
          value={filterPetName}
          onChangeText={setFilterPetName}
        />

        {filteredPets.length > 0 &&
          filteredPets.map((pet) => (
            <View key={pet.id} style={styles.petItem}>
              <Text style={styles.petText}>
                Name: {pet.name} | Type: {pet.type} | Breed: {pet.breed} | Age:{" "}
                {pet.age}
              </Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => {
                    setEditingPetId(pet.id);
                    setName(pet.name);
                    setType(pet.type);
                    setBreed(pet.breed);
                    setAge(pet.age.toString());
                    setModalVisible(true);
                  }}
                >
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <Modal
                  animationType="fade"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                  }}
                >
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>Edit Pet Details</Text>
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                      />
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Type"
                        value={type}
                        onChangeText={setType}
                      />
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Breed"
                        value={breed}
                        onChangeText={setBreed}
                      />
                      <TextInput
                        style={styles.modalInput}
                        placeholder="Age"
                        value={age}
                        onChangeText={setAge}
                        keyboardType="numeric"
                      />
                      <TouchableOpacity
                        style={styles.submitButton}
                        onPress={() => {
                          handleAddOrEditPet();
                          setModalVisible(!modalVisible);
                        }}
                      >
                        <Text style={styles.submitButtonText}>Update Pet</Text>
                      </TouchableOpacity>
                      <Pressable
                        style={[styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}
                      >
                        <Text style={styles.textStyle}>Close</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeletePet(pet.id)}
                >
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </View>
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  content: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: "#333",
  },
  input: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 12,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  button: {
    height: 50,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  petItem: {
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  petText: {
    fontSize: 16,
    color: "#555",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  editButton: {
    backgroundColor: "#FFA726",
    padding: 8,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: "#F44336",
    padding: 8,
    borderRadius: 6,
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },

  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },

  buttonClose: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 20,
  },

  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginTop: 20,
    marginBottom: 20,
  },

  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },

  modalInput: {
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 12,
    width: "100%",
    fontSize: 16,
  },

  submitButton: {
    height: 50,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
  },

  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
