from typing import TypedDict


class LocationPoint(TypedDict):
    latitude: float
    longitude: float


class LocationRectangle(TypedDict):
    low: LocationPoint
    high: LocationPoint


class LocationCircle(TypedDict):
    center: LocationPoint
    radius: float


class LocationBias(TypedDict, total=False):
    rectangle: LocationRectangle
    circle: LocationCircle


class QueryConfig(TypedDict, total=False):
    name: str
    textQuery: str
    includedType: str
    locationBias: LocationBias
