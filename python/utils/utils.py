from datetime import datetime


def date_format(date: datetime) -> str:
    return date.strftime("%d/%m/%Y")
