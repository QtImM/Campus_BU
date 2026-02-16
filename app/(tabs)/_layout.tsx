import { Tabs } from 'expo-router';
import { BookOpen, Calendar, Map, School, User } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          height: 85,
          backgroundColor: '#F3F4F6', // Solid light gray
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
        },
        tabBarBackground: undefined, // Remove blur for a solid look
        tabBarActiveTintColor: '#1E3A8A', // Primary
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          marginBottom: 10,
        },
        tabBarIconStyle: {
          marginTop: 10,
        },
      }}
    >
      {/* Hidden redirect tab */}
      <Tabs.Screen
        name="index"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="campus"
        options={{
          title: t('navigation.home'),
          tabBarLabel: t('navigation.home'),
          tabBarIcon: ({ color, size }) => (
            <Calendar color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: t('navigation.map'),
          tabBarLabel: t('navigation.map'),
          tabBarIcon: ({ color, size }) => (
            <Map color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="course"
        options={{
          title: t('navigation.course'),
          tabBarLabel: t('navigation.course'),
          tabBarIcon: ({ color, size }) => (
            <BookOpen color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="classroom"
        options={{
          title: t('navigation.classroom'),
          tabBarLabel: t('navigation.classroom'),
          tabBarIcon: ({ color, size }) => (
            <School color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="connect"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('navigation.me'),
          tabBarLabel: t('navigation.me'),
          tabBarIcon: ({ color, size }) => (
            <User color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
