# FanChain by SportsCastr Smart Contract


FanChain tokens are based on the ERC20 standard but also adopts ERC721-style features when they are distributed or accepted within the FanChain ecosystem (including any wallet that adds support for our DApp.)

Similar to the concept of a “colored coin,” FanChain tokens are the synthesis of a fungible token with a non-fungible token. Although the FanChain token is fully ERC20-compliant, its implementation of the ERC20 specification allows for additional information to be stored on a per-address basis. This additional metadata contains the breakdown of an addresses’ token balance by team, league or event.

FanChain tokens can be transferred and monitored by any ERC20 compatible wallet without care or concern of the extra metadata (“stamps”), but the extra data associated with each stamped token (e.g. team or league breakdown) becomes visible in FanChain-aware systems.

Storing the stamped-metadata at the address-level, as opposed to the token level (as in the case of ERC721), allows for enhanced functionality. This includes:

1. Divisibility: Unlike pure ERC721-tokens, FanChain tokens can be decimalized to allow for fine-grain and micro transactions. FanChain tokens can be transferred and stored as fractions of a token, instead of only in whole-token increments.
2. Lower Gas Prices: Transfers between addresses do not require a transaction per token, but can be executed using a simple, low-cost group operation (even when transferring team, league or event-specific tokens). This significantly reduces the Gas consumed when using FanChain’s DApp. Consequently, transactions only consume slightly more Gas than a basic ERC20 operation, especially when compared to ERC721 bulk transfers.

While FanChain tokens have non-fungible aspects, they are at their core a fungible (ERC20) token. This fungibility allows for existing systems to utilize FanChain tokens without regard for the stamps.

---


This software is based on https://github.com/OpenZeppelin/zeppelin-solidity, which is licensed under the <a href="https://github.com/OpenZeppelin/zeppelin-solidity/blob/master/LICENSE">MIT License</a>.
