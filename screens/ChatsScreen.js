import React, { useLayoutEffect, useEffect, useState, useCallback } from 'react'
import { View, BackHandler } from 'react-native'
import { auth, db } from '../firebase'
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Avatar } from 'react-native-elements/dist/avatar/Avatar';
import { GiftedChat, Bubble, Send } from 'react-native-gifted-chat';
import { removeDots } from '../Utils/Utils';

const ChatsScreen = ({ route, navigation }) => {
    const [messages, setMessages] = useState([]);
    const { User } = route.params;
    const user1 = removeDots(auth?.currentUser?.email);
    const user2 = removeDots(User._id);
    let chatId = "";

    const chatRef = db.collection("Chats").where(user1, "==", true)
        .where(user2, "==", true);

    useLayoutEffect(() => {
        chatRef.get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    chatId = doc.id;
                    var unsubscribe = db.collection("Chats").doc(chatId).collection('messages').orderBy('createdAt', 'desc')
                        .onSnapshot(snapshot => {
                            if (snapshot) {
                                setMessages(
                                    snapshot.docs.map(doc => ({
                                        _id: doc.data()._id,
                                        text: doc.data().text,
                                        createdAt: doc.data().createdAt.toDate(),
                                        user: doc.data().user
                                    }))
                                )
                            }
                        })
                    return () => unsubscribe;
                });
            })
    }, [])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        const { _id, text, createdAt, user } = messages[0];
        if (chatId === "") {
            var ref = db.collection("Chats").doc();
            chatId = ref.id;
            db.collection("Chats").doc(chatId).set({
                [user1]: true,
                [user2]: true,
            });
        }
        db.collection(`Chats/${chatId}/messages`).add({
            _id,
            text,
            createdAt,
            user
        });
    }, []);

    const goBack = () => {
        navigation.goBack();
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            title: User.name,
            headerLeft: () => (
                <View style={{ marginLeft: 20 }}>
                    <Avatar rounded source={{ uri: User.avatar }} />
                </View>
            ),
            headerRight: () => (
                <TouchableOpacity style={{ marginRight: 20 }} onPress={goBack}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </TouchableOpacity>
            )
        })
    }, []);

    return (
        <GiftedChat
            messages={messages}
            showAvatarForEveryMessage={true}
            onSend={messages => onSend(messages)}
            user={{
                _id: auth?.currentUser?.email,
                name: auth?.currentUser?.displayName,
                avatar: auth?.currentUser?.photoURL
            }}
            renderBubble={props => {
                return (
                    <Bubble
                        {...props}
                        wrapperStyle={{
                            left: {
                                backgroundColor: '#83c5be',
                            },
                            right: {
                                backgroundColor: '#2a9d8f',
                            }
                        }}
                    />
                );
            }}
            renderSend={props => {
                return (
                    <Send {...props} textStyle={{ color: '#2a9d8f' }} label={'Enviar'} />
                )
            }}
        />
    )
}

export default ChatsScreen
