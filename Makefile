include .env

.PHONY: all clean build format deploy deploy-local deploy-monad test help

all: clean build test

# Clean build artifacts
clean:
	@echo "Cleaning build artifacts..."
	cd foundry && rm -rf out cache

# Build contracts
build:
	@echo "Building contracts..."
	cd foundry && forge build

# Format code
format:
	@echo "Formatting code..."
	cd foundry && forge fmt

# Deploy to testnet
deploy:
	@echo "Deploying LoanadLendingMarket to testnet..."
	cd foundry && forge script script/Deploy.s.sol:DeployLoanadLendingMarket --rpc-url $(RPC_URL) --account Testnet --broadcast --verify -vvvv

# Deploy to local anvil
deploy-local:
	@echo "Deploying LoanadLendingMarket to local anvil..."
	cd foundry && forge script script/Deploy.s.sol:DeployLoanadLendingMarket --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast

# Deploy to Monad testnet
deploy-monad:
	@echo "Deploying LoanadLendingMarket to Monad testnet..."
	cd foundry && forge script script/Deploy.s.sol:DeployLoanadLendingMarket --rpc-url $(MONAD_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --skip-simulation

# Deploy to BaseSepolia testnet
deploy-basesepolia:
	@echo "Deploying LoanadLendingMarket to BaseSepolia testnet..."
	cd foundry && forge script script/Deploy.s.sol:DeployLoanadLendingMarket --rpc-url $(BASE_SEPOLIA_RPC_URL) --private-key $(PRIVATE_KEY) --broadcast --skip-simulation

# Verify contract on Monad testnet
verify-monad:
	@echo "Verifying LoanadLendingMarket on Monad testnet..."
	cd foundry && forge verify-contract \
		--rpc-url https://testnet-rpc.monad.xyz \
		--verifier sourcify \
		--verifier-url 'https://sourcify-api-monad.blockvision.org' \
		$(CONTRACT) \
		foundry/contracts/LoanadLendingMarket.sol:LoanadLendingMarket

verify-basesepolia:
	@echo "Verifying LoanadLendingMarket on BaseSepolia testnet..."
	cd foundry && forge verify-contract \
		--rpc-url $(BASE_SEPOLIA_RPC_URL) \
		--verifier blockscout \
		--verifier-url 'https://base-sepolia.blockscout.com/api' \
		--compiler-version 0.8.30 \
		$(CONTRACT) \
		contracts/LoanadLendingMarket.sol:LoanadLendingMarket

# Run tests
test:
	@echo "Running tests..."
	cd foundry && forge test -vvv

# Start local anvil node
anvil:
	@echo "Starting local Anvil node..."
	anvil

# Install dependencies
install:
	@echo "Installing dependencies..."
	cd foundry && forge install

# Update dependencies
update:
	@echo "Updating dependencies..."
	cd foundry && forge update

# Show help
help:
	@echo "Available commands:"
	@echo "  make build       - Build contracts"
	@echo "  make test        - Run tests"
	@echo "  make format      - Format code"
	@echo "  make deploy      - Deploy to testnet"
	@echo "  make deploy-local- Deploy to local anvil"
	@echo "  make deploy-monad- Deploy to Monad testnet"
	@echo "  make deploy-basesepolia- Deploy to BaseSepolia testnet"
	@echo "  make verify-monad CONTRACT=<address> - Verify contract on Monad"
	@echo "  make verify-basesepolia CONTRACT=<address> - Verify contract on BaseSepolia"
	@echo "  make anvil       - Start local anvil node"
	@echo "  make clean       - Clean build artifacts"
	@echo "  make install     - Install dependencies"
	@echo "  make update      - Update dependencies"
	@echo "  make help        - Show this help"