try:
    import requests
    import colorama
except ModuleNotFoundError as e:
    modulename = str(e).split("No module named ")[1].replace("'", "")
    input(f"Please install module with: pip install {modulename}")
    exit()

import requests
import ctypes
from colorama import Fore, init
import os

ctypes.windll.kernel32.SetConsoleTitleW("Proxy Scrapper v0.1 | By Tayz")
init(convert=True)


def main():

    proxies = requests.get(
        "https://api.proxyscrape.com/v2/?request=getproxies&protocol=http&timeout=10000&country=all&ssl=all&anonymity=all").text.replace("\n", "")

    with open("proxies.txt", "w") as file:
        file.write(proxies)

    print(f"{Fore.GREEN}{len(proxies.splitlines())} proxies have been downloaded !{Fore.RESET}")
    os.system("pause")


main()
