# Accela

Accela is your osu! bot

Accela strives to become a simple and elegant looking osu! bot which only shows the user the most important information.

## Installation

Use the package manager [node.js](https://nodejs.org/en/) to install Accela.

```bash
npm install
```

## Config File

To use Accela create a config.json inside the file directory with the following code

```json
{
	"prefix": ">>",
	"token": "Your_Token",
	"owners": ["Owner ID, Co-Owner ID"],
	"servers": ["Private Server ID", "Other Server ID"]

	"osu_key": "Your_Api1_Key",
	"osu_key_v2": "Your_Api2_Key"
}
```

## Running Accela

Run in the src folder

```
> node Accela.P
Altnernative: 
> nodemon Accela.P
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## Special Thanks
- Phil#9284
- Rop
- Stedoss
- Noah
- Ek

## License
[GNU GPLv3](https://choosealicense.com/licenses/gpl-3.0/)
