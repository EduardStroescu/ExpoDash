# ExpoDash

## Introduction

Product ordering application made with expo/react-native.

## Overview

The aim of this project is to create a web and mobile product ordering application tailored towards small businesses who want to be able to manage everything from a single endpoint.
Current features include user and admin accounts, admin dashboard for tracking orders and managing products, realtime order tracking and updating for both types of accounts.

Future Goals: push notifications, live support chat

### Features

- User Accounts/Admin Accounts
- Admin Dashboard
- Can create new products and edit existing ones
- Realtime order tracking and updating

### Technologies Used

- [Expo](https://expo.dev/)
- [Supabase](https://github.com/supabase/supabase)
- [Stripe](https://github.com/stripe/stripe-node)
- [Redux](https://redux-toolkit.js.org/)
- [Redux-Toolkit](https://redux.js.org/)
- [Tanstack Query](https://tanstack.com/query/latest/docs/framework/react/overview)
- [React-Hook-Form](https://github.com/react-hook-form/react-hook-form)
- [Zod](https://github.com/colinhacks/zod)
- [Tamagui](https://tamagui.dev/)
- [React-Native-Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started)
- [Lottie-React-Native](https://github.com/lottie-react-native/lottie-react-native)
- [A coustom version of React-Gifted-Charts to work on the Web too](https://gifted-charts.web.app/)
- Typescript

```

Remember to update `.env` with your Supabase keys, website URL and Stripe keys!

Example:

_Provided by Supabase_

EXPO_PUBLIC_SUPABASE_URL = //Public Supabase key or Local IP to run locally
EXPO_PUBLIC_SUPABASE_PUBLIC_KEY = //Public Supabase key or Local key to run locally
Check this link for more information about running [Supabase Locally](https://supabase.com/docs/guides/cli/local-development)

_Provided by Stripe_

EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

_Provide Demo Accounts made on Supabase_
__Need to be manually created from the Supabase Dashboard__

EXPO_PUBLIC_ADMIN_DEMO_ACCOUNT_ID=
EXPO_PUBLIC_ADMIN_DEMO_ACCOUNT_PASS=
EXPO_PUBLIC_USER_DEMO_ACCOUNT_ID=
EXPO_PUBLIC_USER_DEMO_ACCOUNT_PASS=

```

## Local development

```bash

git clone https://github.com/EduardStroescu/ExpoDash.git

npm install or npx expo install
Inside [your_project_name]/node_modules > replace react-native-gifted-charts with the one from: https://github.com/EduardStroescu/ExpoDash/tree/edited-react-native-gifted-charts

Create a Supabase project, open Docker and run the following:
npx supabase login
npx supabase start - From here you also get the keys for running Supabase locally
npx supabase push - to sync remote Supabase db with the local one


npm run start -- install any other required dependencies if asked && open with Expo Go on your mobile device if using Windows || Device Emulator on mac

```

## Building for production

```bash
_For Web /w Vercel_
[More info on](https://docs.expo.dev/distribution/publishing-websites/) and [here for Vercel](https://vercel.com/docs/cli)

npx expo export -p web
npx serve dist --single
npm install -g vercel@latest
vercel build
Copy everything from your dist folder to your new .vercel/output/static
vercel deploy --prebuilt

eas build --platform all

More info here: https://docs.expo.dev/deploy/build-project/

```
