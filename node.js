import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

dns.setServers([
  '8.8.8.8',
  '1.1.1.1'
]);

dns.resolveSrv(
  '_mongodb._tcp.cluster0.jfkut42.mongodb.net',
  (error, addresses) => {
    if (error) {
      console.error('DNS ERROR:', error);
      return;
    }

    console.log('DNS SUCCESS:', addresses);
  }
);