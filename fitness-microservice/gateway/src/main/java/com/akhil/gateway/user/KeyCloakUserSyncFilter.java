package com.akhil.gateway.user;

import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import org.springframework.web.server.WebFilter;
import org.springframework.web.server.WebFilterChain;
import reactor.core.publisher.Mono;

@Component
@Slf4j
@RequiredArgsConstructor
public class KeyCloakUserSyncFilter implements WebFilter {

    private final UserService userService;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, WebFilterChain chain) {
        String token = exchange.getRequest().getHeaders().getFirst("Authorization");
        String userId = exchange.getRequest().getHeaders().getFirst("X-User-ID");
        RegisterRequest registerRequest=getUserDetails(token);
        if(userId==null){
            assert registerRequest != null;
            userId=registerRequest.getKeyCloakId();
        }
        if (userId != null && token != null) {
            String finalUserId = userId;
            return userService.validateUser(userId)
                    .flatMap(exists -> {
                        if (!exists) {
                            log.info("User does not exist. Registering user: {}", finalUserId);
                            // Register User
                            if(registerRequest!=null){
                                return  userService.registerUser(registerRequest)
                                        .then(Mono.empty());
                            } else{
                                return Mono.empty();
                            }
                        } else {
                            log.info("User already exists, skipping sync.");
                            return Mono.empty();
                        }
                    })
                    .then(Mono.defer(() -> {
                        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                                .header("X-User-Id", finalUserId)
                                .build();
                        return chain.filter(exchange.mutate().request(mutatedRequest).build());
                    }));
        }

        // If no userId or token is present, continue the filter chain normally
        return chain.filter(exchange);
    }

    private RegisterRequest getUserDetails(String token) {
        try {
          String tokenWithoutBearer=token.replace("Bearer ","").trim();
            SignedJWT signedJWT=SignedJWT.parse(tokenWithoutBearer);
            JWTClaimsSet claimsSet=signedJWT.getJWTClaimsSet();
            return RegisterRequest.builder()
                    .email(claimsSet.getStringClaim("email"))
                    .keyCloakId(claimsSet.getStringClaim("sub"))
                    .password("dummy@123123")
                    .firstName(claimsSet.getStringClaim("given_name"))
                    .lastName(claimsSet.getStringClaim("family_name"))
                    .build();

        } catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }
}


//KeyCloakUserSyncFilter implements WebFilter — and WebFilters in Spring WebFlux run on every request automatically (unless you add some specific condition to skip).


