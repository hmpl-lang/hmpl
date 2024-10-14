# Changelog

## 2.1.4 (2024-10-14)

- Adding auto generation for `body` in `HMPLRequestInit`
- String parsing has been reworked
- Adding context

## 2.1.3 (2024-09-29)
- Added memoization functionality.
- Replaced `isRepeatable` with `repeat`.
- Fixed bug: replaced a reply to a `Comment` when the default response is not fulfilled (200-299).
- Added an options object to the `compile` function.

## 2.1.2 (2024-09-29)
- Replaced `mode` with boolean variable `isRepeatable`.
- Updated mode handling in the request:
  - Introduced validation for `req.mode` to allow only "one" or "all" values.
  - Added a check to ensure `req.isRepeatable` is defined and is a boolean value.
  - Defaulted `req.isRepeatable` to `true` if not specified, with `modeAttr` set to "all" for repeatable requests and "one" otherwise.
- Clarified `MODE` error message regarding `AFTER`.

## 2.1.1 (2024-08-05)
- Updated version from `2.1.0` to `2.1.1`.
- Updated URL from `https://github.com/hmpljs/hmpl` to `https://github.com/hmpl-lang/hmpl`.

## 2.1.0 (2024-08-05)
- Removed the period from the `hmpl` header description.

## 2.0.2 (2024-07-22)
- Updated `Readme.md` file.

## 2.0.1 (2024-07-15)
- Updated `hmpl-js` script tag to specify version `2.0.0`.

## 2.0.0 (2024-07-12)
- Updated `Readme.md` file.

## 1.0.9 (2024-06-17)
- Changed `after` attribute in `<request>` from `click:.getHTML` to `click:.getTitle`.
- Modified `templateFn` usage to directly append `elementObj.response` to `bodyEl`.

## 1.0.8 (2024-06-12)
- Changed from `HMPLResponse` to `HMPLInstance`.
- Changed from `HMPLResponse` to `HMPLInstance` in `templateObject`.

## 1.0.7 (2024-06-12)
- Changed from `HMPLResponse` to `HMPLTemplateObject`.

## 1.0.6 (2024-06-12)
- Updated version from `1.0.5` to `1.0.6`.

## 1.0.5 (2024-06-10)
- Updated version from `1.0.4` to `1.0.5`.

## 1.0.4 (2024-06-10)
- Updated `Readme.md` file.

## 1.0.3 (2024-06-03)
- Updated `hmpl-js` script tag version from `1.0.2` to `1.0.3`.
- Changed `wrapper.appendChild(value)` to `wrapper.appendChild(value.content.firstElementChild)`.
- Updated installation instructions to reference `hmpl-js` version `1.0.3`.
- Updated version from `1.0.2` to `1.0.3`.

## 1.0.2 (2024-06-03)
- Updated `hmpl-js` script tag version from `1.0.1` to `1.0.2`.
- Updated installation instructions to reference `hmpl-js` version `1.0.2`.
- Changed condition from checking `if (!optionsId)` to `if (optionsId)`.

## 1.0.1 (2024-06-03)
- Updated installation instructions to reference `hmpl-js` version `1.0.1`.
- Updated version from `1.0.0` to `1.0.1`.
