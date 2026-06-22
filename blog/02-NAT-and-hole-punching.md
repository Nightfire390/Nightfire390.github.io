---
title: NAT and Hole Punching
date: 2026-06-22
tag: note
---

## NAT

The general idea is that NAT allows outbound traffic but restrict inbound traffic, so to make sure the client behind NAT is able to communicate with a server outside, hole punching is done. This means that the client will send an outbound traffic, which would add the destination address and/or port to the allowlist (for restricted NAT) for the time being so that the server can communicate back to the client using that port.

The allow list isnt global and is specific to the port, otherwise it would be an obvious security flaw. This setup suggests that the router is responsible for accepting the connection, so port forwarding on router level is possible. That would be true if you have unique IP, but carriers add CGNAT.

IETF changed the names from *Asymmetric* to *Endpoint-Independent* NAT and *Symmetric* to *Endpoint-Dependent* NAT, based on how the public port is assigned.

Network Address Translation has various types, each one determining how lenient is hole punching. Hole Punching allows inbound traffic from the internet. Now the levels of hole punching how lenient it is depends on the type. One could allow the anyone in, others are restricted.

### Asymmetric NAT

Asymmetric NAT (also called *Cone NAT* or *Endpoint-Independent NAT*) allows internal mapping of local port and public port to be same for various connection. So if you made a connection to a server A with your local port 3333 and it was mapped with router's 4000, if you make a connection sometime later to another server or device and use the same local port 3333, the mapping will remain unchanged and the router port will be 4000 for that connection as well. There are different types based on restrictions:

- **Full Cone**: Once an outbound packet is sent to a server (or anywhere, even dead IP), the port its used to sent is opened permanently (until closed). The thing about full cone is that it allows traffic from any IP and port.

- **IP Restricted Cone**: Allows connection from the IP to which the outbound packet was sent. This means that particular IP can communicate with the client via the router in that particular port.

- **Port Restricted Cone**: Allows connection from the particular IP and port to which the outbound traffic was sent. So the particular IP and port can communicate via that hole (mapping).

Asymmetric NAT doesn't change its port mapping according to the endpoint. If the mapping is already established it would reuse, which is why its called Endpoint-Independent.

### Symmetric NAT

Symmetric NAT (also called *Endpoint-Dependent NAT*) refers to NAT configuration where the internal mapping changes for every connection. So even if the local port remains unchanged for two different connections, the mapping will change and the public port of router will change.

For Symmetric NAT, the way public port assigned is dependent on the endpoint's IP and port. Routers has various ways to determine which port to open for what case. It can be sequential (common for home routers) or it can be a PRNG dependent on Source IP, Source port, Destination Ip, Destination Port. Thus making the latter much harder to predict, basically unpredictable. Hence, its called Endpoint-Dependent.

### CGNAT

Carrier Grade NAT is a concept for ISPs. They implement NAT of their own to keep taking more customers without running out of IPv4. CGNAT is just NAT done on carrier level. Thus we have two possibilities for CGNAT:

- **Endpoint-Independent Port-Preserving**: Same as Asymmetric, with the addition of port-preserving, which means when your router assigns a port, the CGNAT tries to assign it the same port on its router.

- **Endpoint-Dependent**: Same as Symmetric.

**Note:**
This changes things for port-forwarding, now the double NAT (CGNAT over home network) means the router settings are pointless because the CGNAT is blocking inbound traffic. But, this also means, anyone within the same CGNAT can access the local service exposed via port forwarding behind home network's NAT as long as home router has unique IP behind CGNAT. So, if your communication is intra-carrier, port would be forwarded to the ip provided inside CGNAT and someone behind the same CGNAT can communicate with it.

Now, ISPs can block direct communication among devices behind CGNAT, which would, again, render port forwarding pointless. None of it, however, affects hole-punching though, since that mechanism would just work as though it was working for inter-carrier.
