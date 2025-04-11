import { useState, useEffect } from 'react';
import { Text, View } from 'tamagui';
import { Keyboard, ScrollView } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { getCurrentUser } from '@/services/user';
import { useUsers } from '@/hooks/users/useUsers';
import { Input } from '@/components/atoms/inputs/input';
import { UserCard } from '@/components/molecules/cards/users-card';
import { Link } from 'expo-router';
import { useAuth } from '@/hooks/auth/useAuth';

export default function HomeScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [submittedSearchTerm, setSubmittedSearchTerm] = useState('');
  const { login } = useAuth();

  const { data: users, isLoading, error } = useUsers(submittedSearchTerm);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        console.log('Current user:', user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (users) {
      console.log('users', users);
      console.log('users.length', users.length);
    }
  }, [users]);

  const handleSearchSubmit = () => {
    setSubmittedSearchTerm(searchTerm);
    Keyboard.dismiss();
    console.log('Search submitted:', searchTerm);
  };

  return (
    <View flex={1} backgroundColor="$background">
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <Input
          placeholder="Rechercher"
          variant="outline"
          size="lg"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
          icon={<FontAwesome name="search" size={18} color="#aaa" />}
        />
  
        {isLoading && <Text>Chargement des utilisateurs...</Text>}
        {error && <Text>Erreur lors du chargement.</Text>}
  
        {users &&
          users.length > 0 &&
          users.map((user) => (
            <UserCard
              key={user.id}
              imageUrl="https://picsum.photos/200"
              name={user.first_name}
              region="France"
              status="En ligne"
            />
          ))}
  
        <Link
          href={{
            pathname: '/room/[id]',
            params: { id: 1 },
          }}
        >
          Go To first room
        </Link>

      </ScrollView>
    </View>
  );
} 
