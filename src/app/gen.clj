(ns app.gen
    (:require
      [app.data :as data]
      [hiccup.core :as h]))

(def s (slurp "1.html"))
(def t (slurp "index.html"))

(defn- render-test [i test]
  [:code {:style "display: flex; flex-flow: wrap;"}
   [:span.unit-test test]
   [:span {:id (str "pass" i)
           :class "hidden"
           :style "color: green; align-self: center; width: 4.5em; margin-left: auto;"}
    "🟢 pass"]
   [:span {:id (str "fail" i)
           :class "hidden"
           :style "color: red; align-self: center; width: 5.5em; margin-left: auto;"}
    "🔴 uh-oh"]])

(defn- render-modal [this {:keys [id title]}]
  [:dialog#myModal {:onclick="if (event.target === this) this.close()"}
   [:h2 {:class "text-3xl font-semibold mb-4"}
    (format "Congratulations on solving problem #%s!" (:id this))]
   (if id
     [:p "Next problem "
      [:a {:class "text-blue-600" :href (str id ".html")}
       (format "#%s %s" id title)]]
     [:p "You have solved all the problems! "
      [:a {:class "text-blue-600" :href "https://github.com/whamtet/4janet"}
       "Feel free to contribute more."]])])

(defn- render-link [{:keys [id title]}]
  [:div.mb-4
   [:a {:class "text-blue-600" :href (format "/%s.html" id)} title]])

(defn render-links []
  (format t (h/html (map render-link data/problems))))

(defn- render [{:keys [title tests description difficulty] :as this} next]
  (format s
          title
          difficulty
          description
          (h/html (map-indexed render-test tests))
          (h/html (render-modal this next))))

(def problems (map list data/problems (conj (subvec data/problems 1) nil)))

(defn -main [& args]
  (doseq [[this next] problems]
    (spit (format "dist/%s.html" (:id this))
          (render this next)))
  (spit "dist/index.html" (render-links)))
