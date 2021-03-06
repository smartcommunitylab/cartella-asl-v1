package it.smartcommunitylab.cartella.asl.config;

import java.util.Map;

import javax.servlet.Filter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.security.oauth2.resource.PrincipalExtractor;
import org.springframework.boot.autoconfigure.security.oauth2.resource.ResourceServerProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.RememberMeAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.oauth2.client.OAuth2ClientContext;
import org.springframework.security.oauth2.client.OAuth2RestTemplate;
import org.springframework.security.oauth2.client.filter.OAuth2ClientAuthenticationProcessingFilter;
import org.springframework.security.oauth2.client.filter.OAuth2ClientContextFilter;
import org.springframework.security.oauth2.client.token.grant.code.AuthorizationCodeResourceDetails;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableOAuth2Client;
import org.springframework.security.web.authentication.rememberme.RememberMeAuthenticationFilter;
import org.springframework.security.web.authentication.rememberme.TokenBasedRememberMeServices;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import it.smartcommunitylab.cartella.asl.model.users.ASLUser;
import it.smartcommunitylab.cartella.asl.security.ASLUserDetails;
import it.smartcommunitylab.cartella.asl.security.AacUserInfoTokenServices;

@Configuration
@EnableOAuth2Client
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	@Value("${oauth.serverUrl}")
	private String oauthServerUrl;

	@Autowired
	@Value("${rememberMe.key}")
	private String rememberMeKey;

	@Autowired
	OAuth2ClientContext oauth2ClientContext;

	@Autowired
	CustomLogoutSuccessHandler customLogoutSuccessHandler;

	@Autowired
	private UserDetailsService userDetailsServiceImpl;

	@Bean
	@ConfigurationProperties("security.oauth2.client")
	public AuthorizationCodeResourceDetails aac() {
		return new AuthorizationCodeResourceDetails();
	}

	@Bean
	@ConfigurationProperties("security.oauth2.resource")
	public ResourceServerProperties aacResource() {
		return new ResourceServerProperties();
	}

	@Bean
	public FilterRegistrationBean oauth2ClientFilterRegistration(OAuth2ClientContextFilter filter) {
		FilterRegistrationBean registration = new FilterRegistrationBean();
		registration.setFilter(filter);
		registration.setOrder(-100);
		return registration;
	}

	private Filter ssoFilter() {
		OAuth2ClientAuthenticationProcessingFilter aacFilter = new OAuth2ClientAuthenticationProcessingFilter("/login/aac");
		OAuth2RestTemplate aacTemplate = new OAuth2RestTemplate(aac(), oauth2ClientContext);
		aacFilter.setRestTemplate(aacTemplate);
		AacUserInfoTokenServices tokenServices = new AacUserInfoTokenServices(aacResource().getUserInfoUri(), aac().getClientId());
		tokenServices.setRestTemplate(aacTemplate);
		tokenServices.setPrincipalExtractor(new PrincipalExtractor() {

			@SuppressWarnings("unchecked")
			@Override
			public Object extractPrincipal(Map<String, Object> map) {
				ASLUser aslUser = new ASLUser();
				// dataSetInfo.setSubject((String) map.get("userId"));
				aslUser.setName((String) map.get("name"));
				aslUser.setSurname((String) map.get("surname"));
				aslUser.setToken((String) map.get("token"));
				aslUser.setRefreshToken((String) map.get("refreshToken"));
				aslUser.setExpiration((Long) map.get("expiration"));
				Map<String, Object> accounts = (Map<String, Object>) map.get("accounts");
				if (accounts.containsKey("adc")) {
					Map<String, Object> adc = (Map<String, Object>) accounts.get("adc");
					aslUser.setCf((String) adc.get("pat_attribute_codicefiscale"));
				}
				if (accounts.containsKey("google")) {
					Map<String, Object> google = (Map<String, Object>) accounts.get("google");
					aslUser.setEmail((String) google.get("email"));
				}
				if (accounts.containsKey("facebook")) {
					Map<String, Object> facebook = (Map<String, Object>) accounts.get("facebook");
					aslUser.setEmail((String) facebook.get("email"));
				}
				if (accounts.containsKey("internal")) {
					Map<String, Object> internal = (Map<String, Object>) accounts.get("internal");
					aslUser.setEmail((String) internal.get("email"));
				}
				if (accounts.containsKey("cie")) {
					Map<String, Object> internal = (Map<String, Object>) accounts.get("cie");
					aslUser.setCf((String) internal.get("fiscalNumberId"));
				}				
				ASLUserDetails details = new ASLUserDetails(aslUser);
				return details;
			}
		});
		aacFilter.setTokenServices(tokenServices);
		return aacFilter;
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http.headers().frameOptions().disable();
		http.logout().clearAuthentication(true).deleteCookies("rememberme", "JSESSIONID").invalidateHttpSession(true).logoutSuccessHandler(customLogoutSuccessHandler);

//		http.csrf().disable().antMatcher("/**").authorizeRequests().antMatchers("/", "/index.html", "/login**", "/logout**", "/swagger-ui.html", "/v2/api-docs**").permitAll();
		
		http.csrf().disable().authorizeRequests().antMatchers("/asl-azienda/**","/asl-scuola/**","/asl-studente/**","/asl-ruoli/**").authenticated().and().addFilterBefore(ssoFilter(), BasicAuthenticationFilter.class); // .formLogin().permitAll();
//		http.csrf().disable().authorizeRequests().antMatchers("/asl-azienda/**","/asl-scuola/**","/asl-studente/**").authenticated().and().addFilterBefore(ssoFilter(), BasicAuthenticationFilter.class); // .formLogin().permitAll();


		http.formLogin().loginPage("/login/aac");
	}

	@Bean
	public RememberMeAuthenticationFilter rememberMeAuthenticationFilter() throws Exception {
		return new RememberMeAuthenticationFilter(authenticationManager(), tokenBasedRememberMeService());
	}

	@Bean
	public RememberMeAuthenticationProvider rememberMeAuthenticationProvider() {
		return new RememberMeAuthenticationProvider(tokenBasedRememberMeService().getKey());
	}

	@Bean
	public TokenBasedRememberMeServices tokenBasedRememberMeService() {
		TokenBasedRememberMeServices service = new TokenBasedRememberMeServices(rememberMeKey, userDetailsServiceImpl);
		service.setAlwaysRemember(true);
		service.setCookieName("rememberme");
		service.setTokenValiditySeconds(3600 * 24 * 365 * 1);
		return service;
	}
}
