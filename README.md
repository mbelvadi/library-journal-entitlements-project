# Library Journal Entitlements Project

For a complete overview of the project and presentation links about it please refer to the [wiki](https://github.com/UPEI-Android/library-journal-entitlements-project/wiki).

This project is licensed under GPLv3. See [`LICENSE`](./LICENSE).

[![Test](https://github.com/UPEI-Android/library-journal-entitlements-project/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/UPEI-Android/library-journal-entitlements-project/actions/workflows/test.yml)
[![Build](https://github.com/UPEI-Android/library-journal-entitlements-project/actions/workflows/build.yml/badge.svg?branch=release)](https://github.com/UPEI-Android/library-journal-entitlements-project/actions/workflows/build.yml)

## Overview

Many academic libraries subscribe to several packages of electronic journals to which it is given "perpetual access rights" (PAR) to each journal title for each year it subscribes. Often, library staff and sometimes even patrons need to be able to quickly determine if a particular year of a particular journal is "owned" (perpetual rights even after cancellation) by the institution. They might look for it by its title or one of its two "ISSN" numbers (print and online).

A central organization called CRKN manages many of these subscriptions/licenses for its members. CRKN has recently started creating spreadsheets that include for each member the "entitlement" list of what titles/years that institution has PAR for.

Each package has a separate spreadsheet file - there are about 10 or so of these from CRKN.

Each spreadsheet has all of the data for all approximately 75 members, of which each CRKN member institution is one "column" in one of the tabs. They are all in exactly the same format, just different data for different publisher-packages.

The spreadsheets are updated a couple of times per year each and are made available on a public website managed by CRKN.

**The goal of this project** is to create a public-facing web front end that each institution can easily copy/configure to just their own PAR, to:

- generate a report by package/title/year of all entitlements
- allow the website user to search through all of the spreadsheets by title or issn to find all of the PAR years that institution has
