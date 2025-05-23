import { Connector } from "../../types/connector.type";

export const staticConnectors: Connector[] = [
  {
    name: 'File',
    type: 'fileupload',
    logo: 'src/pages/Connector/ConnectorIcons/File.svg',
    connectors: "0",
    category: 'File',
    description: 'Upload structured data files like CSV, Excel, and JSON for detailed analysis, quick exploration, and insightful visualization.',
  },
  {
    name: 'Salesforce Object Manager',
    type: 'salesforce',
    logo: 'src/pages/Connector/ConnectorIcons/SalesForce.svg',
    connectors: "0",
    category: 'Application',
    description: 'Connect and retrieve both standard and custom Salesforce CRM objects to analyze customer relationships, leads, opportunities, and sales performance.',
  },
  {
    name: 'Gitlab',
    type: 'gitlab',
    logo: 'src/pages/Connector/ConnectorIcons/Gitlab.svg',
    connectors: "0",
    category: 'Application',
    description: 'Integrate with GitLab to fetch repository data in JSON format for analysis and to track project progress and updates.',
  },
  {
    name: 'LOQ',
    type: 'loq',
    logo: 'src/pages/Connector/ConnectorIcons/LOQ.svg',
    connectors: "0",
    category: 'Internal',
    description: 'Fetch real-time CRM data from LOQ, including leads, opportunities, quotations, projects, accounts, and contact information for detailed analysis.',
  },
  {
    name: 'MySQL',
    type: 'mysql',
    logo: 'src/pages/Connector/ConnectorIcons/MySQL.svg',
    connectors: "0",
    category: 'Database',
    description: 'Connect to MySQL, a widely-used relational database, to fetch data from tables for fast retrieval and analysis.',
  },
  {
    name: 'Firebase',
    type: 'firebase',
    logo: 'src/pages/Connector/ConnectorIcons/Firebase.svg',
    connectors: "0",
    category: 'Database',
    description: 'Connect to Firebase to pull real-time NoSQL data and user analytics from mobile and web applications for analysis and reporting.',
  },
  {
    name: 'Elasticsearch',
    type: 'elasticsearch',
    logo: 'src/pages/Connector/ConnectorIcons/Elasticsearch.svg',
    connectors: "0",
    category: 'Database',
    description: 'Sync and retrieve data from Elasticsearch indexes, enabling fast querying, exploration, and visualization of stored information.',
  },
  {
    name: 'CockroachDB',
    type: 'cockroachdb',
    logo: 'src/pages/Connector/ConnectorIcons/CockroachDB.svg',
    connectors: "0",
    category: 'Database',
    description: 'Fetch data from distributed CockroachDB tables to support querying and real-time analytics for scalable database environments.',
  },
  {
    name: 'Cassandra',
    type: 'cassandra',
    logo: 'src/pages/Connector/ConnectorIcons/Cassandra.svg',
    connectors: "0",
    category: 'Database',
    description: 'Pull data from Cassandra’s distributed tables for efficient querying and analytics in large-scale, fault-tolerant systems.',
  },
  {
    name: 'AWS DynamoDB',
    type: 'dynamodb',
    logo: 'src/pages/Connector/ConnectorIcons/DynamoDB.svg',
    connectors: "0",
    category: 'Database',
    description: 'Connect to AWS DynamoDB to retrieve NoSQL data from tables, enabling real-time querying and analysis of your data.',
  },
  {
    name: 'Couchbase Capella',
    type: 'couchbase',
    logo: 'src/pages/Connector/ConnectorIcons/Couchbase.svg',
    connectors: "0",
    category: 'Database',
    description: 'Sync and fetch data from Couchbase Capella for querying, indexing, and performing high-performance analytics on document-oriented NoSQL databases.',
  },
  {
    name: 'Redis',
    type: 'redis',
    logo: 'src/pages/Connector/ConnectorIcons/Redis.svg',
    connectors: "0",
    category: 'Database',
    description: 'Retrieve data from Redis in the form of strings, lists, sets, sorted sets, hashes, and streams for real-time analysis and reporting.',
  },
  {
    name: 'Apache CouchDB',
    type: 'couchdb',
    logo: 'src/pages/Connector/ConnectorIcons/CouchDB.svg',
    connectors: "0",
    category: 'Database',
    description: 'Fetch data from CouchDB to support real-time document storage, querying, and analytics in your application ecosystem.',
  },
  {
    name: 'Microsoft Sharepoint',
    type: 'sharepoint',
    logo: 'src/pages/Connector/ConnectorIcons/SharePoint.svg',
    connectors: "0",
    category: 'File',
    description: 'Retrieve CSV, Excel, and JSON files from SharePoint for easy extraction, analysis, and visualization of business data.',
  },
  {
    name: 'ManageEngine ServiceDesk Plus',
    type: 'sdp',
    logo: 'src/pages/Connector/ConnectorIcons/SDP.svg',
    connectors: "0",
    category: 'Application',
    description: 'Fetch modules like problems, assets, changes, and CMDB from ServiceDesk Plus for detailed reporting and system analysis.',
  },
  {
    name: 'PostgreSQL',
    type: 'postgresql',
    logo: 'src/pages/Connector/ConnectorIcons/PostgreSQL.svg',
    connectors: "0",
    category: 'Database',
    description: 'Fetch data from PostgreSQL relational tables for fast and reliable data retrieval and analysis in real-time.',
  },
  {
    name: 'Oracle Database',
    type: 'oracledb',
    logo: 'src/pages/Connector/ConnectorIcons/OracleDB.svg',
    connectors: "0",
    category: 'Database',
    description: 'Connect to Oracle Database to pull structured data from tables for fast retrieval and complex analytics.',
  },
  {
    name: 'MariaDB',
    type: 'mariadb',
    logo: 'src/pages/Connector/ConnectorIcons/MariaDB.svg',
    connectors: "0",
    category: 'Database',
    description: 'Retrieve and analyze data from MariaDB relational tables for effective querying and fast database analysis.',
  },
  {
    name: 'Microsoft SQL Server',
    type: 'mssql',
    logo: 'src/pages/Connector/ConnectorIcons/MSSQL.svg',
    connectors: "0",
    category: 'Database',
    description: 'Fetch structured data from SQL Server tables for reporting and analysis using its reliable database system.',
  },
  {
    name: 'Supabase',
    type: 'supabase',
    logo: 'src/pages/Connector/ConnectorIcons/Supabase.svg',
    connectors: "0",
    category: 'Database',
    description: 'Fetch structured data from Supabase tables, enabling seamless analysis and reporting of your stored data.',
  },
  {
    name: 'HROne',
    type: 'hrone',
    logo: 'src/pages/Connector/ConnectorIcons/HROne.svg',
    connectors: "0",
    category: 'Application',
    description: 'Fetch detailed employee data and HR-related information from HROne for reporting and analysis purposes.',
  },
  {
    name: 'Ceipal',
    type: 'ceipal',
    logo: 'src/pages/Connector/ConnectorIcons/Ceipal.svg',
    connectors: "0",
    category: 'Application',
    description: 'Retrieve data from modules such as Users, Applicants, Clients, Job Postings, Submissions, Interviews, and Placements for detailed analysis.',
  },
  {
    name: 'Dynamics 365 Business Central',
    type: 'business-central-dynamics',
    logo: 'src/pages/Connector/ConnectorIcons/BCD.svg',
    connectors: "0",
    category: 'Application',
    description: 'Fetch data from Business Central including modules like Vendor Ledger Entries, Customer Ledger Entries, and more for reporting and analysis.',
  },
  {
    name: 'OneHash',
    type: 'onehash',
    logo: 'src/pages/Connector/ConnectorIcons/OneHash.svg',
    connectors: "0",
    category: 'Application',
    description: 'Fetch CRM data from OneHash to analyze customer data, sales, marketing activities, and performance insights.',
  },
  {
    name: 'Spotlight',
    type: 'spotlight',
    logo: 'src/pages/Connector/ConnectorIcons/Spotlight.svg',
    connectors: "0",
    category: 'Internal',
    description: 'Retrieve internal data from Spotlight to support decision-making and insights into your organization’s key metrics.',
  },
];
