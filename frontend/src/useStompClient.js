import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const useStompClient = (url, topicsToSubscribe, onMessageReceived) => {
	const stompClient = useRef(null);

	useEffect(() => {
		// Connect to the WebSocket endpoint
		stompClient.current = new Client({
		brokerURL: url,
		webSocketFactory: () => new SockJS(url),
		onConnect: () => {
			console.log('Connected to STOMP');
			
			// Subscribe to topics
			topicsToSubscribe.forEach(topic => {
			stompClient.current.subscribe(topic, message => {
				onMessageReceived(message);
			});
			});
		},
		onStompError: (frame) => {
			console.error('STOMP Error:', frame);
		},
		});

		stompClient.current.activate();

		// Clean up on component unmount
		return () => {
		if (stompClient.current) {
			stompClient.current.deactivate();
		}
		};
	}, [url, topicsToSubscribe, onMessageReceived]);

	// Function to send a message
	const sendMessage = (destination, body) => {
		if (stompClient.current && stompClient.current.active) {
		stompClient.current.publish({
			destination,
			body: JSON.stringify(body),
		});
		}
	};

	return { sendMessage };
};

export default useStompClient;