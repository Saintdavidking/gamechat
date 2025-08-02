import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  ChannelList,
  Channel,
  MessageList,
  MessageInput,
  OverlayProvider,
} from 'stream-chat-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const API_KEY = '4umujg35b2ks';
const USER_ID = 'david';
const chatClient = StreamChat.getInstance(API_KEY);
const Stack = createNativeStackNavigator();

function ChannelListScreen({ navigation }: any) {
  return (
    <ChannelList
      onSelect={(channel) => {
        navigation.navigate('ChannelScreen', { channel });
      }}
    />
  );
}

function ChannelScreen({ route }: any) {
  const { channel } = route.params;

  return (
    <Channel channel={channel}>
      <MessageList />
      <MessageInput />
    </Channel>
  );
}

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const connect = async () => {
      await chatClient.connectUser(
        {
          id: USER_ID,
          name: 'David',
        },
        chatClient.devToken(USER_ID)
      );
      setIsReady(true);
    };

    connect();

    return () => {
      chatClient.disconnectUser();
    };
  }, []);

  if (!isReady) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <OverlayProvider>
        <Chat client={chatClient}>
          <NavigationContainer>
            <Stack.Navigator>
              <Stack.Screen name="ChannelList" component={ChannelListScreen} />
              <Stack.Screen name="ChannelScreen" component={ChannelScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </Chat>
      </OverlayProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
