import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView, 
  StatusBar,
  Dimensions
} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

// --- Theme Constants ---
const COLORS = {
  brand: '#0c91e9',
  bg: '#f8fafc',
  text: '#0f172a',
  muted: '#64748b',
  white: '#ffffff',
  border: '#e2e8f0',
};

// --- Components ---
const Card = ({ children, style }: any) => (
  <View style={[styles.card, style]}>{children}</View>
);

const Button = ({ title, onPress, variant = 'primary' }: any) => (
  <TouchableOpacity 
    onPress={onPress}
    style={[
      styles.button, 
      variant === 'secondary' ? styles.buttonSecondary : styles.buttonPrimary
    ]}
  >
    <Text style={[
      styles.buttonText,
      variant === 'secondary' ? styles.buttonTextSecondary : styles.buttonTextPrimary
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
);

// --- Screens ---
function HomeScreen({ navigation }: any) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Trade Coupons{"\n"}<Text style={{color: COLORS.brand}}>Instantly.</Text></Text>
        <Text style={styles.heroSubtitle}>The safest marketplace for unused digital rewards.</Text>
        <Button title="Browse Deals" onPress={() => navigation.navigate('Browse')} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Coupons</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {[1, 2, 3].map(i => (
            <Card key={i} style={styles.featuredCard}>
              <View style={styles.badge}><Text style={styles.badgeText}>AMAZON</Text></View>
              <Text style={styles.cardPrice}>₹499</Text>
              <Text style={styles.cardTitle}>₹500 Gift Card</Text>
              <Button title="Buy Now" />
            </Card>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

function BrowseScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <Feather name="search" size={20} color={COLORS.muted} />
        <TextInput placeholder="Search coupons..." style={styles.searchInput} />
      </View>
      <ScrollView style={styles.section}>
        {[1, 2, 3, 4, 5].map(i => (
          <Card key={i} style={styles.listItem}>
            <View style={styles.listContent}>
              <View>
                <Text style={styles.listPlatform}>PHONEPE</Text>
                <Text style={styles.listTitle}>Flat ₹100 Off Zomato</Text>
              </View>
              <Text style={styles.listPrice}>₹20</Text>
            </View>
            <Button title="Purchase" />
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Navigation ---
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName: any;
            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'Browse') iconName = 'search';
            else if (route.name === 'Sell') iconName = 'plus-circle';
            else if (route.name === 'Wallet') iconName = 'credit-card';
            return <Feather name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: COLORS.brand,
          tabBarInactiveTintColor: COLORS.muted,
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Browse" component={BrowseScreen} />
        <Tab.Screen name="Sell" component={HomeScreen} />
        <Tab.Screen name="Wallet" component={HomeScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  hero: {
    padding: 30,
    paddingTop: 60,
    backgroundColor: COLORS.white,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 48,
  },
  heroSubtitle: {
    fontSize: 18,
    color: COLORS.muted,
    marginTop: 15,
    marginBottom: 30,
    lineHeight: 26,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: COLORS.text,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  featuredCard: {
    width: 250,
    marginRight: 15,
  },
  badge: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  badgeText: {
    color: COLORS.brand,
    fontSize: 10,
    fontWeight: '800',
  },
  cardPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 5,
  },
  cardTitle: {
    fontSize: 16,
    color: COLORS.muted,
    marginBottom: 20,
  },
  button: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPrimary: {
    backgroundColor: COLORS.brand,
  },
  buttonSecondary: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  buttonTextPrimary: {
    color: COLORS.white,
  },
  buttonTextSecondary: {
    color: COLORS.text,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    margin: 20,
    paddingHorizontal: 15,
    borderRadius: 16,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  listItem: {
    marginBottom: 15,
  },
  listContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  listPlatform: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.brand,
    marginBottom: 2,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  listPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.text,
  },
  horizontalScroll: {
    paddingBottom: 10,
  }
});
