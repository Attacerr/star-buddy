import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

interface APODImage {
  title: string;
  date: string;
  url: string;
  thumbnail_url?: string;
  explanation: string;
}

export default function Explore() {
  const router = useRouter();
  const [image, setImage] = useState<APODImage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

  useEffect(() => {
    fetchAPOD();
  }, []);

  const fetchAPOD = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/apod`);
      if (!response.ok) throw new Error("Failed to fetch image");
      const data = await response.json();
      setImage(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchAPOD}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {image && (
        <>
          <Text style={styles.title}>{image.title}</Text>
          <Text style={styles.date}>{image.date}</Text>

          {image.thumbnail_url ? (
            <Image
              source={{ uri: image.thumbnail_url }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : image.url.includes("youtube") ? (
            <View style={styles.videoPlaceholder}>
              <Text style={styles.videoText}>Video Content</Text>
              <Text style={styles.videoSubtext}>Tap to open: {image.url}</Text>
            </View>
          ) : (
            <Image
              source={{ uri: image.url }}
              style={styles.image}
              resizeMode="contain"
            />
          )}

          <Text style={styles.explanation}>{image.explanation}</Text>

          <TouchableOpacity style={styles.refreshButton} onPress={fetchAPOD}>
            <Text style={styles.refreshButtonText}>Get Another Image</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    marginBottom: 20,
  },
  videoPlaceholder: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  videoText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  videoSubtext: {
    fontSize: 12,
    color: "#666",
  },
  explanation: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  refreshButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 40,
  },
  refreshButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
