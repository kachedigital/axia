import { createClient } from 'contentful';

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

if (!spaceId || !accessToken) {
    console.warn('Contentful Space ID or Access Token is missing from environment variables');
}

export const contentfulClient = createClient({
    space: spaceId || '',
    accessToken: accessToken || '',
});
