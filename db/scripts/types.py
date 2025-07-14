from typing import TypedDict


class LocationPoint(TypedDict):
    latitude: float
    longitude: float


class LocationRectangle(TypedDict):
    low: LocationPoint
    high: LocationPoint


class LocationBias(TypedDict):
    rectangle: LocationRectangle


class QueryConfig(TypedDict, total=False):
    name: str
    textQuery: str
    includedType: str
    locationBias: LocationBias
