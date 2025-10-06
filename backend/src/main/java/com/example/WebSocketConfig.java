import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.SubscribableChannel;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry){
		registry.enableSimpleBroker("/topic", "/queue");
		registry.setApplicationDestinationPrefixes("/app");
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
		registry.addEndpoint("/Game").setAllowedOrigins("*");
		registry.addEndpoint("/Friends").setAllowedOrigins("*");
		registry.addEndpoint("/GameList").setAllowedOrigins("*").withSockJS();
	}

	@Bean
    public SimpMessagingTemplate simpMessagingTemplate(SubscribableChannel clientOutboundChannel) {
        return new SimpMessagingTemplate(clientOutboundChannel);
    }
}