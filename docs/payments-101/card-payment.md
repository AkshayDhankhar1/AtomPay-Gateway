# A ₹500 card payment, end to end

Four phases: **authorisation** (a hold is placed), **capture** (merchant confirms the sale),
**clearing** (the details are exchanged) and **settlement** (money actually moves).

```mermaid
sequenceDiagram
    autonumber
    actor C as Customer
    participant M as Merchant
    participant PA as Gateway / Aggregator
    participant A as Acquirer
    participant N as Card network
    participant I as Issuer

    rect rgb(235, 245, 255)
    Note over C,I: 1. Authentication + authorisation (seconds)
    C->>M: Click "Pay ₹500"
    M->>PA: Create order (server-to-server)
    C->>PA: Enter card on hosted checkout
    PA->>N: 3-D Secure request (via 3DS server, directory server)
    N->>I: Route to issuer's ACS
    I->>C: OTP challenge
    C->>I: OTP
    PA->>A: Authorise ₹500
    A->>N: Authorise ₹500
    N->>I: Authorise ₹500 (routed by BIN)
    I->>I: Check balance, limits, fraud. Place HOLD of ₹500
    I-->>N: Approved (response code 00)
    N-->>A: Approved
    A-->>PA: Approved
    PA-->>M: Webhook: payment.authorized
    end

    rect rgb(240, 255, 240)
    Note over M,A: 2. Capture (now, or later for delayed capture)
    M->>PA: Capture ₹500
    PA->>A: Capture, added to today's batch
    end

    rect rgb(255, 248, 230)
    Note over A,I: 3. Clearing (end of day, files)
    A->>N: Clearing file (presentment)
    N->>I: Presentment
    I->>I: Turn the hold into a real debit
    end

    rect rgb(255, 238, 238)
    Note over I,M: 4. Settlement (T+1 or so)
    I->>N: Pay the net amount owed
    N->>A: Pay the net amount (minus interchange and network fee)
    A->>PA: Credit the aggregator's escrow/nodal account
    PA->>M: Payout: ₹500 minus MDR and GST on it
    end
```

## Who holds the money at each step

| Step                  | Where the ₹500 is                                                              |
| --------------------- | ------------------------------------------------------------------------------ |
| After authorisation   | Still in the customer's account, **blocked** (debit) or limit reduced (credit) |
| After capture         | Same. Capture is an instruction, not a transfer                                |
| After clearing        | Debited by the issuer, owed to the network's settlement                        |
| During settlement     | Moves issuer → network settlement → acquirer → aggregator's **escrow** account |
| After merchant payout | In the merchant's bank account, minus MDR + GST                                |

A pure **gateway** never holds the money: the acquirer pays the merchant directly. An
**aggregator** (Razorpay, Cashfree, AtomPay) receives it into an escrow account and settles the
merchant itself, which is why the RBI authorises aggregators.

## What breaks

- **Auth succeeded, our response lost:** customer's money is held, we don't know. That's the
  `UNKNOWN` state (Day 19). We ask again; we never guess.
- **Authorised, never captured:** the hold expires after some days and the customer gets it back.
- **Captured, customer disputes later:** chargeback. The issuer pulls the money back through the
  network; the merchant must prove the sale.
