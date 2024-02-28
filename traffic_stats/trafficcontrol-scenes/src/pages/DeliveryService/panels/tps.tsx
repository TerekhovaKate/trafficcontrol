/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { PanelBuilders, SceneQueryRunner, VizPanel } from "@grafana/scenes";
import { INFLUXDB_DATASOURCES_REF } from "const";

export const getTpsPanel = (): VizPanel => {
	const tpsQueries = [
		{
			measurement: "tps_2xx",
			query: "SELECT mean(value) FROM \"monthly\".\"tps_2xx.ds.1min\" WHERE $timeFilter AND deliveryservice='$deliveryservice'" +
				" GROUP BY time(60s) ORDER BY asc",
			rawQuery: true,
			refId: "A",
			resultFormat: "time_series",
		},
		{
			query: "SELECT mean(value) FROM \"monthly\".\"tps_3xx.ds.1min\" WHERE $timeFilter AND deliveryservice='$deliveryservice'" +
				" GROUP BY time(60s) ORDER BY asc",
			rawQuery: true,
			refId: "B",
			resultFormat: "time_series",
		},
		{
			query: "SELECT mean(value) FROM \"monthly\".\"tps_4xx.ds.1min\" WHERE $timeFilter AND deliveryservice='$deliveryservice'" +
				" GROUP BY time(60s) ORDER BY asc",
			rawQuery: true,
			refId: "C",
			resultFormat: "time_series",
		},
		{
			query: "SELECT mean(value) FROM \"monthly\".\"tps_5xx.ds.1min\" WHERE $timeFilter AND deliveryservice='$deliveryservice' " +
				"GROUP BY time(60s) ORDER BY asc",
			rawQuery: true,
			refId: "D",
			resultFormat: "time_series",
		},
	];

	const qr = new SceneQueryRunner({
		datasource: INFLUXDB_DATASOURCES_REF.deliveryServiceStats,
		queries: [...tpsQueries],
	});

	return PanelBuilders.timeseries()
		.setTitle("TPS")
		.setData(qr)
		.setOption("legend", {calcs: ["max"], showLegend: true})
		.setCustomFieldConfig("axisCenteredZero", true)
		.setCustomFieldConfig("spanNulls", true)
		.build();
};
