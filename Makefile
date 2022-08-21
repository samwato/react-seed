# Create server keys
.PHONY: generate_keys
generate_keys:
ifeq ("$(wildcard certs/localhost*.pem)", "")
	mkdir -p certs && \
	openssl req -x509 -newkey rsa:4096 -nodes \
		-subj '/CN=localhost' \
		-keyout certs/localhost-key.pem \
		-out certs/localhost-cert.pem
endif
