import { Link, Stack, usePathname } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

export default function NotFoundScreen() {
  const pathname = usePathname();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.text}>This screen doesn't exist.</Text>
        <Text style={styles.url}>URL: {pathname}</Text>
        <Link href="/activation" style={styles.link}>
          <Text>Go to activation screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 600,
  },
  url: {
    fontSize: 14,
    color: '#666',
    marginVertical: 10,
    fontFamily: 'monospace',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});