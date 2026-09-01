import React, { useState } from "react";
import { api } from "#/api";
import { createOrderUpsertModel, type OrderUpsertModel, type SeatingBasicModel } from "#/models";

type OrderUpsertPanelProps = {
  model: OrderUpsertModel;

};
