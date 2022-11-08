import { AutoGridColumn } from "@glideapps/glide-data-grid";

export interface TypedColumn extends AutoGridColumn{
    type:string
}

enum columnTypes{
    TEXT="TEXT",
    LABEL="LABEL",
    PREDICTION="PREDICTION",
    INTEGER="INTEGER"
}

