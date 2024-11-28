export const AgentPoolABI = [
    'function swapAndDeposit(address tokenAddress, uint256 tokenAmount, uint256 minPToken, address recipient) payable external;',
    'function deposit(uint256 amount, address recipient) external',
    'function withdraw(uint256 amount, address recipient) external',
    'function requestWithdraw(uint256 amount, address recipient) external',
    'function bridgeToDepinChain(uint256 amount) external',
    'function rebase(uint256 amount) external'
]

export const ERC20ABI = [
    'function balanceOf(address account) external view returns (uint256)',
    'function transfer(address recipient, uint256 amount) external returns (bool)',
    'function decimals() external view returns (uint8)',
    'function symbol() external view returns (string memory)',
    'function name() external view returns (string memory)',
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function allowance(address owner, address spender) external view returns (uint256)',
    'event Transfer(address indexed from, address indexed to, uint256 value)',
    'event Approval(address indexed owner, address indexed spender, uint256 value)'
]

export const BridgeAgentABI = [
    'function deposit(uint256 amount, address recepient) external payable',
    'function bridgeToMainChain(uint256 amount) external',
    'function withdraw(uint256 amount, address recepient) external',
    'function requestWithdraw(uint256 amount) external'
]