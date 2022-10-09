```mermaid
sequenceDiagram

    participant admin as Existing admin
    participant contract as RBAC contract
    participant listener as Contract listener
    participant aws as AWS
    participant newAdmin as New admin


    admin->>+contract: Call MakeAdmin function
    contract->>+listener: Listening for Admin Events
    listener->>+aws: Create User and Password
    aws->>+newAdmin: Send Email and Encrypted Password
```