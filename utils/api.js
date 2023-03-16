import axios from "./axios";
import { Alert } from "react-native";

// ADS ----------------------

export async function getAdsByAuthor(user, token) {
  try {
    const response = await axios.get(`ad/author/${user}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (e) {
    if (e.response?.data === "jwt expired") {
      return "jwt expired";
    } else {
      Alert.alert("Erreur", "La récupération des annonces de l'utilisateur a échoué…");
      return [];
    }
  }
}

export async function getAdsByCity(city, token) {
  try {
    const response = await axios.get(`ad/city/${city}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (e) {
    if (e.response?.data === "jwt expired") {
      return "jwt expired";
    } else {
      Alert.alert("Erreur", "La récupération des annonces par ville a échoué…");
      return [];
    }
  }
}

export async function createAd(
  author,
  title,
  content,
  serviceDate,
  availability,
  streetName,
  streetNumber,
  zipCodeLocation,
  cityLocation,
  token
) {
  try {
    await axios.post(
      "/ad",
      {
        creationDate: new Date(),
        author,
        title,
        content,
        serviceDate,
        availability,
        streetName,
        streetNumber,
        zipCodeLocation,
        cityLocation,
        token,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return "OK";
  } catch (e) {
    Alert.alert("Erreur", "Ajout de l'annonce impossible…");
  }
}

export async function deleteAd(id, token) {
  await axios.delete(`/ad/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// CURRENT ADS

export async function getAllCurrentAdsFromUser(user, token) {
  try {
    const response = await axios.get(`ad/current/from/${user}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (e) {
    Alert.alert("Erreur", "La récupération des demandes de réservation a échoué…");
    return [];
  }
}

export async function getAllCurrentAdsForUser(user, token) {
  try {
    const response = await axios.get(`ad/current/for/${user}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (e) {
    Alert.alert("Erreur", "La récupération des réservations a échoué…");
    return [];
  }
}

// AUTHENTICATION ----------------

export async function createUser(
  pseudo,
  name,
  firstname,
  streetName,
  streetNumber,
  email,
  password,
  phone,
  zipCodeLocation,
  cityLocation
) {
  const response = await axios.post("/user", {
    pseudo,
    name,
    firstname,
    streetName,
    streetNumber,
    email,
    password,
    phone,
    zipCodeLocation,
    cityLocation,
  });
  return response.data.accessToken;
}

export async function login(pseudo, password) {
  const response = await axios.post("/connexion", {
    pseudo,
    password,
  });
  return response.data.accessToken;
}

// USERS ---------------------

export async function getUser(pseudo, token) {
  try {
    const response = await axios.get(`/user/${pseudo}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (e) {
    if (!e.response) {
      Alert.alert("Erreur", "Connexion à l'API impossible…");
      return [];
    } else {
      console.log("failed to fetch user :", e.response?.status, e.response?.data);
      if (e.response?.data === "jwt expired") {
        return "jwt expired";
      } else {
        Alert.alert("Erreur", "La récupération de l'utilisateur a échoué…");
        return [];
      }
    }
  }
}

export async function updateUser(pseudo, firstname, name, phone, email, description, token) {
  await axios.patch(
    "/user/",
    {
      pseudo,
      firstname,
      name,
      phone,
      email,
      description,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export async function updateUserAddress(
  pseudo,
  streetName,
  streetNumber,
  zipCodeLocation,
  cityLocation,
  token
) {
  await axios.patch(
    "/user/",
    {
      pseudo,
      streetName,
      streetNumber,
      zipCodeLocation,
      cityLocation,
      token,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export async function updateUserPassword(pseudo, password, token) {
  await axios.patch(
    "/user/",
    {
      pseudo,
      password,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export async function deleteUser(pseudo, token) {
  await axios.delete(`/user/${pseudo}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// SUBSCRIPTIONS -----------------

export async function getSubscribers(pseudo, token) {
  try {
    const response = await axios.get(`/subscription/subscribers/${pseudo}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (e) {
    Alert.alert("Erreur", "La récupération des abonnnés a échoué…");
    return [];
  }
}

export async function getSubscriptions(pseudo, token) {
  try {
    const response = await axios.get(`/subscription/subscriptions/${pseudo}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (e) {
    Alert.alert("Erreur", "La récupération des abonnements a échoué…");
    return [];
  }
}

export async function removeSubscription(pseudoSubscriber, pseudoSubscription, token) {
  try {
    await axios.delete(`/subscription/${pseudoSubscriber}/${pseudoSubscription}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (e) {
    Alert.alert("Erreur", "Impossible de se désabonner…");
  }
}

export async function addSubscription(pseudoSubscriber, pseudoSubscription, token) {
  try {
    await axios.post(
      `/subscription/`,
      {
        pseudoSubscriber,
        pseudoSubscription,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (e) {
    Alert.alert("Erreur", "Impossible de s'abonner…");
  }
}

// SEARCH --------------------------

export async function searchUser(user, token) {
  try {
    const response = await axios.get(`/user/search/${user}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (e) {
    Alert.alert("Erreur", "Recherche d'utilisateur impossible…");
    return [];
  }
}

export async function searchAd(search, token) {
  try {
    const response = await axios.get(`/ad/search/${search}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (e) {
    Alert.alert("Erreur", "Recherche d'annonces impossible…");
    return [];
  }
}

// LOCATIONS ---------------------

export async function getAllLocations(token) {
  try {
    const response = await axios.get("/location/", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (e) {
    Alert.alert("Erreur", "La récupération des villes a échoué…");
    return [];
  }
}

// REVIEWS -----------------------

export async function getAllReviewsByUser(user, token) {
  try {
    const response = await axios.get(`/review/user/${user}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (e) {
    Alert.alert("Erreur", "La récupération des évaluations a échoué…");
    return [];
  }
}

export async function addReview(score, comment, booking, author, recipient, token) {
  try {
    await axios.post(
      `/review/`,
      {
        score,
        comment,
        booking,
        author,
        recipient,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
  } catch (e) {
    if (e.response?.data === "Already rated") {
      Alert.alert(
        "Erreur",
        "Vous ne pouvez pas laisser plusieurs évaluations pour la même réservation."
      );
    } else {
      Alert.alert("Erreur", "Impossible de publier l'évaluation...");
    }
  }
}

// BOOKING ------------------------

export async function getBooking(id, token) {
  try {
    const response = await axios.get(`/booking/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (e) {
    Alert.alert("Erreur", "La récupération de la réservation a échoué…");
    return "";
  }
}

export async function requestBooking(ad, user, token) {
  await axios.post(
    `/booking/request`,
    {
      ad,
      user,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export async function approveBooking(id, token) {
  await axios.patch(
    `/booking/approve`,
    {
      id,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export async function closeBooking(id, token) {
  await axios.patch(
    `/booking/close`,
    {
      id,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}

export async function deleteBooking(id, token) {
  await axios.delete(`/booking/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// STATS --------------------------

export async function nbServicesReceived(user, token) {
  try {
    const response = await axios.get(`/booking/completed/for/${user}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (e) {
    Alert.alert("Erreur", "Impossible de récupérer le nombre de services reçus…");
    return null;
  }
}

export async function nbServicesRendered(user, token) {
  try {
    const response = await axios.get(`/booking/completed/by/${user}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (e) {
    Alert.alert("Erreur", "Impossible de récupérer le nombre de services rendus");
    return null;
  }
}
