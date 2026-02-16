import { createClient } from 'contentful';

const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

if (!spaceId || !accessToken) {
    throw new Error('Missing Contentful configuration variables.');
}

export const client = createClient({
    space: spaceId,
    accessToken: accessToken,
});
