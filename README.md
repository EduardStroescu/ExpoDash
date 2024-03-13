# ExpoDash(WIP)

## Introduction

Product ordering application made with expo/react-native.

## Overview

The aim of this project is to create a web and mobile product ordering application with user and admin accounts, admin dashboard for tracking orders and managing products.

Future Goals: location tracking, push notifications, live support chat.

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
- [React-Hook-Form](https://github.com/react-hook-form/react-hook-form)
- [Zod](https://github.com/colinhacks/zod)
- Typescript

```

Remember to update `.env` with your Supabase keys, website URL and Stripe keys!

Example:

_Provided by Supabase_

EXPO_PUBLIC_SUPABASE_URL =
EXPO_PUBLIC_SUPABASE_PUBLIC_KEY =

EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=

_Provided by Stripe_

STRIPE_SECRET_KEY=

_Provide Demo Accounts made on Supabase_

EXPO_PUBLIC_ADMIN_DEMO_EMAIL=
EXPO_PUBLIC_ADMIN_DEMO_PASS=
EXPO_PUBLIC_USER_DEMO_EMAIL=
EXPO_PUBLIC_USER_DEMO_PASS=

```

## Local development

```bash

git clone

npm install

npm run start -- install required dependencies if asked && open with Expo Go on your mobile device if using Windows || device emulator on mac

```

## Building for production

```bash

eas build --platform all

More info: https://docs.expo.dev/deploy/build-project/

```
